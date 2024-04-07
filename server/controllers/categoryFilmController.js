import Category from "../models/Category.js"

class CategoryController {
    create(req, res, next) {
        res.render("category/create")
    }

    store(req, res, next) {
        const category = new Category(req.body)

        category.save()
            .then(() => res.redirect("/category-film/table-lists"))
            .catch(() => next)
    }

    tableLists(req, res, next) {
        Category.find({})
            .then((categories) => res.render("category/read", { categories }))
            .catch(() => next)
    }
}

export default new CategoryController