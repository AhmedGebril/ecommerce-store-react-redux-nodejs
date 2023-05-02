async function Register(req,res,db){
    const {username,password,email} = req.body
    await db.collection('users').findOne({  
        $or: [
        { username },
        { email },
    ],
    })
    .then(async (data)=>{
        if(data){
            if(data.username == username){
                res.json('username  already registered')
            }else{
                res.json('email already taken')
            }
        }
        else{
            await db.collection('users').insertOne({
                username: username,
                password: password,
                email: email
            }).then(()=>{
                res.status(201).send()
            }).catch(err => {
                res.status(200).json(err.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0].description)
                
            })
        }
    })
}

module.exports= Register
