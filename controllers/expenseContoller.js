const loginModel = require('../models/userLoginsModel')
const sequelize = require('../util/dbConnection');
const expensesModel = require('../models/expensesModel');
/**
 * HOME FOR Expense ROUTES
 * ADD EXPENSE
 * GET EXPENSE
 * DELETE EXPENSE
 */

exports.addExpense = async (req, res, next) => {
try {
    const t = await  sequelize.transaction();
    await expensesModel.create({
        amount: req.body.amount,
        description: req.body.description,
        category: req.body.category,
        userloginId: req.user.id
    }, { transaction: t }).then((data) => {
        const totalExp = Number(req.user.totalexp) + Number(req.body.amount)

        loginModel.update({ totalexp: totalExp }, {
            where: { id: req.user.id }, transaction: t
        })
            .then(async () => {
                await t.commit();
                res.status(200).json(data)
            })
            .catch(async (err) => {
                await t.rollback();
                res.status(500).json({ error: err, message: false })
            })
    })
        .catch(async (err) => {
            await t.rollback();
            res.status(500).json({ error: err, message: false })
        })
} catch(err){console.log(err); console.log("error at expense add")}
   






}




// router.get('/get-expense',
exports.getExpense = async (req, res, next) => {
    try {
        const PAGE = +req.query.page || 1
    
        const ITEMS_PER_PAGE = +req.query.count;
        // console.log("items per ppage",ITEMS_PER_PAGE)
        // console.log("this is my page num", PAGE);
        const USER = req.user.id
        console.log(req.user)
      
    
        const count = await expensesModel.count({where : {userloginId : USER}})
    
        // console.log("Number of records", count);
    
    
        const pageData = await expensesModel.findAll({
    
            offset :(PAGE - 1)*ITEMS_PER_PAGE,
            limit : ITEMS_PER_PAGE,
            where : { userloginId : USER}
        }).then((rows)=>{
            res.json({
                rows : rows,
                currentpage : PAGE,
                hasnextpage : ITEMS_PER_PAGE * PAGE < count,
                nextpage : PAGE + 1,
                haspreviouspage : PAGE > 1,
                previouspage : PAGE -1,
                lastpage : Math.ceil(count/ITEMS_PER_PAGE)
    
            })
            return rows.data
        }).catch(err => console.log(err))
        // console.log(JSON.stringify(pageData))
    } catch(err){console.log(err); console.log("error at get expense")}
   




   


}



// router.delete('/del-expense/:id',
exports.delExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();

        const expID = req.params.id;
    
        console.log(req.user.totalexp);
        // console.log(req.body);
    
    
        const val = await expensesModel.findAll({ where: { id: expID } })
    
        const check = JSON.stringify(val);
        const final = JSON.parse(check)
        const delAmount = final[0].amount;
        console.log(delAmount)
    
    
        const ab = await expensesModel.destroy({ where: { id: expID } }, { transaction: t })
            .then(data => {
    
                const totalExp = Number(req.user.totalexp) - Number(delAmount)
    
                loginModel.update({ totalexp: totalExp }, {
                    where: { id: req.user.id }, transaction: t
                })   .then(async () => {
                    await t.commit();
                    res.status(200).json({data: data, message : "Expense Deleted"})
                })
                .catch(async (err) => {
                    await t.rollback();
                    res.status(500).json({ error: err, message : "Deletion Failure" })
                })
        })
            .catch(async (err) => {
                await t.rollback();
                res.status(500).json({ error: err, message : "Deletion Failure" })
            })
    } catch(err){console.log(err); console.log("error at del expense ")}
   
    }
