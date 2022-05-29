import router from "express"

const Router = router()

Router.get("/", (req, res, next) => {
    res.render("main.ejs")
})

export default Router