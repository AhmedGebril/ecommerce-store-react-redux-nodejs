const jwt = require('jsonwebtoken');

async function Login(req,res,db){
    const{email}=req.body
    const secrectKey = process.env.JWT_SECRET
    await db.collection('users').findOne({email:email}).then((data)=>{
        if(!data){
            res.status(201).send()
        }else{
            user_id = data._id
            if(data.password != req.body.password){
                res.status(201).send()
            }else{
                username=data.username
                token = jwt.sign({user_id}, secrectKey, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true,path:'/' })
                res.status(200).json({username})
            }
        }
    })
}

module.exports = Login