import mongoose from "mongoose"
import Category from "../models/Category.js"

export const addCategory = async (req, res, next) => {
    try {
        const { category, movies } = req.body

        if (!category && category.trim() === "" && movies.length > 0) {
            res.status(422).json({ message: "invalid inputs..." })
        }

        const newCategory = new Category({ category, movies })
        const savedCategory = await newCategory.save()

        res.status(201).json(savedCategory)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getAllCategories = async (req, res, next) => {
    let categories

    try {
        categories = await Category.find()
    } catch (err) {
        console.error(err)
    }

    if (!categories) {
        res.status(500).json({ message: "request failed..." })
    }

    res.status(200).json({ categories })
}

export const getCategoryById = async (req, res, next) => {
    const id = req.params.id

    let category

    try {
        category = await Category.findById(id)
    } catch (err) {
        console.error(err)
    }

    if (!category) {
        res.status(404).json({ message: "invalid category id..." })
    }

    res.status(200).json({ category })
}

export const updateCategory = async (req, res, next) => {
    const id = req.params.id
    const { category, movies } = req.body

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id, { category, movies }, { new: true } // returns object after update
        )

        if (!updatedCategory) {
            res.status(404).json({ message: "invalid category id..." })
        }

        res.status(200).json(updatedCategory)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateMovieInCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId
    const movieId = req.params.movieId
    const { title, img } = req.body

    try {
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, "movies._id": movieId },
            {
                $set: {
                    "movies.$.title": title,
                    "movies.$.img": img,
                },
            },
            { new: true }
        )

        if (!updatedCategory) {
            res.status(404).json({ message: "invalid category or movie id..." })
        }

        res.status(200).json(updatedCategory)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
