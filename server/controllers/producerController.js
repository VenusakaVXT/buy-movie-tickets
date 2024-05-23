import Producer from "../models/Producer.js"

class ProducerController {
    getApiProducer = async (req, res, next) => {
        try {
            const producers = await Producer.find().populate("movies")

            if (!producers) {
                res.status(500).json({ message: "request failed..." })
            }

            res.status(200).json({ producers })
        } catch(err) {
            next(err)
        }
    }

    create(req, res, next) {
        res.render("producer/create")
    }

    store(req, res, next) {
        const producer = new Producer(req.body)

        producer.save()
            .then(() => res.redirect("/producer/table-lists"))
            .catch(() => next)
    }

    tableLists(req, res, next) {
        Producer.find({})
            .then((producers) => res.render("producer/read", { producers }))
            .catch(() => next)
    }

    edit(req, res, next) {
        Producer.findById(req.params.id)
            .then(producer => res.render("producer/edit", { producer }))
            .catch(next)
    }

    update(req, res, next) {
        Producer.updateOne({ _id: req.params.id }, { 
            producerName: req.body.producerName,
            producerEmail: req.body.producerEmail
        })
            .then(() => res.redirect("/producer/table-lists"))
            .catch(next)
    }

    delete(req, res, next) {
        Producer.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/producer/table-lists"))
            .catch(next)
    }
}

export default new ProducerController