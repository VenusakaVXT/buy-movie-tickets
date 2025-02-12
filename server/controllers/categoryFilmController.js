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

    edit(req, res, next) {
        Category.findById(req.params.id)
            .then(category => res.render("category/edit", { category }))
            .catch(next)
    }

    update(req, res, next) {
        Category.updateOne({ _id: req.params.id }, { category: req.body.category })
            .then(() => res.redirect("/category-film/table-lists"))
            .catch(next)
    }

    delete(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/category-film/table-lists"))
            .catch(next)
    }
}

export default new CategoryController