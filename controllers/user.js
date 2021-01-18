const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const Rainbow = require('rainbowvis.js')

module.exports.create = async function (req, res) {

    const candidate = await User.findOne({ login: req.body.login })
    console.log(req.body)
    if (candidate) {
        // Найден пользователь с таким именем
        res.status(409).json({
            "message": 'Юзер с таким именем уже существует'
        })
    } else {
        //Пользователь новый, хешируем пароль и отправляем в базу
        try {
            const salt = bcrypt.genSaltSync(10)
            const password = req.body.password

            const user = new User({
                login: req.body.login,
                password: bcrypt.hashSync(password, salt),
                isOnline: false
            })

            await user.save()
            res.status(201).json({
                "message": "Пользователь успешнео создан"
            })
        } catch (e) {
            throw (e)
        }
    }
}


module.exports.login = async function (req, res) {

    const candidate = await User.findOne({ login: req.body.login })

    if (candidate) {
        if (!candidate.isBanned) {
            try {
                //Пользователь найден, проверяем пароль
                const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
                if (passwordResult) {
                    let rainbow = new Rainbow()
                    rainbow.setNumberRange(1, 10);
                    rainbow.setSpectrum('DarkRed', 'DarkGreen', 'Indigo', 'Maroon', 'Navy', 'Black', 'MidnightBlue', 'Blue');
                    let color = '#' + rainbow.colourAt(Math.floor(Math.random() * 8));
                    //Пароли совпали, генерируем токен
                    const token = jwt.sign({
                        login: candidate.login,
                        _id: candidate._id,
                        isMute: candidate.isMute,
                        isAdmin: candidate.isAdmin,
                        chatColor: color,
                    }, keys.jwt, { expiresIn: 60 * 60 * 5})
                    res.status(200).json({
                        token: `${token}`
                    })
                } else {
                    //Пароли не совпали
                    res.status(409).json({
                        "message": "Пароли не совпадают, попробуйте еще раз"
                    })
                }
            } catch (e) {
                throw (e)
            }
        } else {
            res.status(409).json({
                "message": "Пользователь забанен"
            })

        }
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        const user = new User({
            login: req.body.login,
            password: bcrypt.hashSync(password, salt),
            isOnline: false
        })

        await user.save()
        let rainbow = new Rainbow()
        rainbow.setNumberRange(1, 10);
        rainbow.setSpectrum('DarkRed', 'DarkGreen', 'Indigo', 'Maroon', 'Navy', 'Black', 'MidnightBlue', 'Blue', 'FireBrick', 'Teal');
        let color = '#' + rainbow.colourAt(Math.floor(Math.random() * 10));
        //Пароли совпали, генерируем токен
        const token = jwt.sign({
            login: user.login,
            _id: user._id,
            isMute: user.isMute,
            isAdmin: user.isAdmin,
            chatColor: color,
        }, keys.jwt, { expiresIn: 60 * 60 })
        res.status(200).json({
            token: `${token}`
        })
    }

}



