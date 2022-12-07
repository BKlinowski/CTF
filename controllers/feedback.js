import { db } from "../db.js";

export const postFeedback = async (req, res) => {
    const filter = ["script", "image", "style", "body", "alert", "console"]
    const { name, comment } = req.body;
    console.log(filter.length)
    for (let i=0; i< filter.length; i++){
        const commentLowerCase = comment.toLowerCase()
        if (commentLowerCase.includes(filter[i]) == true){
            res.redirect("/");
            break;
        }   
        if (i == (filter.length-1)){
            try {
                await db.query(`INSERT INTO comments VALUES (default, '${name}', '${comment}')`)
            } catch (error) {
                console.error(error)
            }
            res.redirect("/feedback")
        }
    } 
    }
  
export const getFeedback = async (req, res) => {
    const comments = await db.queryRows(`SELECT comment,name FROM comments ORDER BY id DESC LIMIT 3`)
    res.render('feedback.ejs', {
        comment1: (comments[0].comment), name1: (comments[0].name),
        comment2: (comments[1].comment), name2: (comments[1].name),
        comment3: (comments[2].comment), name3: (comments[2].name),
        isLoggedIn: req.session.user
    })
  }