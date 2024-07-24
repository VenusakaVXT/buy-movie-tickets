import React, { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Stack,
    Avatar,
    Modal
} from "@mui/material"
import { getMovieDetail, getCommentsByMovie } from "../../api/movieApi"
import { userComment, userDeleteComment } from "../../api/userApi"
import SendIcon from "@mui/icons-material/Send"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { convertStr } from "../../util"
import "../../scss/MovieDetail.scss"
import "../../scss/App.scss"

const MovieDetail = () => {
    const [movie, setMovie] = useState()
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idCommentDeleted, setIdCommentDeleted] = useState()
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const userId = localStorage.getItem("customerId")
    const slug = useParams().slug
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        getMovieDetail(slug)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.error(err))
    }, [slug])

    useEffect(() => {
        getCommentsByMovie(slug)
            .then((res) => setComments(res.comments))
            .catch((err) => console.error(err))
    }, [slug])

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isCustomerLoggedIn) {
                const res = await userComment({
                    userId,
                    movieId: movie._id,
                    content: newComment
                })

                // if (res) {
                //     dispatch(customerActions.setRatingPoints(5))
                // }

                setComments([...comments, res.comment])
                setNewComment("")
            } else if (isManagerLoggedIn) {
                toast.info(t("comment.toastInfoStaff"))
            } else {
                toast.info(t("comment.toastInfoLogIn"))
                navigate("/login")
            }
        } catch {
            toast.error(t("comment.toastErrorSend"))
        }
    }

    const handleDeleteComment = async (id) => {
        try {
            await userDeleteComment(id)
            setComments(comments.filter(comment => comment._id !== id))
            setIsModalOpen(false)
            toast.success(t("comment.toastSuccessDelete"))
            // dispatch(customerActions.setRatingPoints(-5))
        } catch {
            toast.error(t("comment.toastErrorDelete"))
        }
    }

    return (
        <Box bgcolor={"#000"} pb={32}>
            {movie && (
                <Box
                    sx={{
                        width: "100%",
                        height: "1024px",
                        backgroundImage: `
                            url(https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))
                        `,
                        backgroundSize: "100% 70%, 100% 100%",
                        backgroundPosition: "0% 0%, 0% 100%",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                    <Box display={"flex"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
                        <Box
                            sx={{
                                width: 220,
                                height: 140,
                                border: "2px solid #fff",
                                borderRadius: 2,
                                overflow: "hidden"
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={`https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg`}
                                alt={movie.title}
                                sx={{ width: "100%", height: "100%" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: 901,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                ml: 5
                            }}
                        >
                            <CardContent>
                                <Typography className="text-border" variant="h4" component="h2">
                                    {i18n.language === "us" ? movie.title : t(`movies.${movie.slug}`)}
                                </Typography>

                                <Typography className="text-border" variant="body1" width={856} textAlign={"justify"}>
                                    {i18n.language === "vn"
                                        ? t(`moviesDescription.${movie.slug}`)
                                        : movie.description !== "" ? movie.description : t("movieDetail.noDescription")}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.director", {
                                        director: movie.director !== "" ? movie.director : t("movieDetail.notyet")
                                    })}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.contentWritter", {
                                        contentWritter:
                                            movie.contentWritter !== "" ? movie.contentWritter : t("movieDetail.notyet")
                                    })}
                                </Typography>

                                <Typography className="text-border" variant="body1" display={"flex !important"}>
                                    {t("movieDetail.actors")}: {movie.actors !== ""
                                        ? movie.actors.split(",").map(actor => (
                                            <a
                                                className="text-border actor-info"
                                                href={`https://vi.wikipedia.org/wiki/${actor.replace(/ /g, "_")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {actor.trim()}
                                            </a>
                                        ))
                                        : t("movieDetail.notyet")
                                    }
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.category", {
                                        category: movie.category.length > 0
                                            ? movie.category.map(c => t(`category.${convertStr(c.category)}`)).join(", ")
                                            : t("movieDetail.notyet")
                                    })}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.releaseDate", {
                                        releaseDate: movie.releaseDate ? movie.releaseDate : t("movieDetail.notyet")
                                    })}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.time", { time: movie.time ? movie.time : t("movieDetail.notyet") })}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    {t("movieDetail.producer", {
                                        producer: movie.producer.length > 0
                                            ? movie.producer.map(p => p.producerName).join(", ") : t("movieDetail.notyet")
                                    })}
                                </Typography>
                            </CardContent>
                        </Box>
                    </Box>

                    <Box display={"flex"} justifyContent={"center"} marginBottom={"24px"}>
                        <Card
                            sx={{
                                width: 560,
                                height: 315,
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                backdropFilter: "blur(30px)",
                                borderRadius: 2,
                            }}
                        >
                            <CardMedia
                                component="iframe"
                                src={`https://www.youtube.com/embed/${movie.trailerId}?controls=1&hd=1&fs=1&rel=0`}
                                alt={movie.title}
                                title={movie.title}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </Card>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <Button className="btn" variant="contained" LinkComponent={Link} to={`/booking/${slug}`}>
                            {t("movieDetail.booking")}
                        </Button>
                        <Button className="btn" variant="contained" onClick={() => {
                            window.scrollBy({ top: 500, left: 0, behavior: "smooth" })
                        }}>
                            {t("movieDetail.seeReviews")}
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "30px 70px"
                        }}
                    >
                        <Typography variant="h4" color={"#e50914"} fontFamily={"600"} mb={1}>
                            {t("comment.feedback")}
                        </Typography>

                        <form onSubmit={handleCommentSubmit} style={{ width: "100%" }}>
                            <Box marginBottom={"20px"} maxHeight={"376px"} className="scrollable-div">
                                {comments && comments.length > 0 ? comments.map((comment) =>
                                    <Box id={comment._id} key={comment._id} mb={"10px"}>
                                        <Box display={"flex"} alignItems={"center"}>
                                            <Stack alignItems={"center"} direction="row" spacing={2} mr={1}>
                                                <Avatar sx={{ width: 35, height: 35 }} />
                                                <Typography variant="subtitle2" fontSize={"0.95rem"} color={"#fff"}>
                                                    {comment.user.name}
                                                </Typography>
                                            </Stack>

                                            <Typography pt={"2px"} sx={{ fontSize: "0.75rem", color: "#ccc" }}>
                                                {comment.periodAfterCreation}
                                            </Typography>
                                        </Box>

                                        <Box ml={"calc(35px + 16px)"}>
                                            <Typography color="#fff" fontSize={"0.875rem"}>
                                                {comment.content}
                                            </Typography>

                                            <Box display={"flex"}>
                                                {comment.user._id === userId && <>
                                                    <Button
                                                        sx={{ p: 0, minWidth: 0, textTransform: "none" }}
                                                        onClick={() => toast.warn(t("comment.toastWarnEdit"))}
                                                    >
                                                        <Typography sx={{
                                                            marginRight: 2,
                                                            fontSize: "0.75rem",
                                                            color: "#ccc",
                                                            "&:hover": {
                                                                textDecoration: "underline",
                                                                cursor: "pointer"
                                                            }
                                                        }}>
                                                            {t("comment.edit")}
                                                        </Typography>
                                                    </Button>

                                                    <Button
                                                        sx={{ p: 0, minWidth: 0, textTransform: "none" }}
                                                        onClick={() => {
                                                            setIdCommentDeleted(comment._id)
                                                            setIsModalOpen(true)
                                                        }}
                                                    >
                                                        <Typography sx={{
                                                            fontSize: "0.75rem",
                                                            color: "#ccc",
                                                            "&:hover": {
                                                                textDecoration: "underline",
                                                                cursor: "pointer"
                                                            }
                                                        }}>
                                                            {t("comment.delete")}
                                                        </Typography>
                                                    </Button>
                                                </>}
                                            </Box>
                                        </Box>
                                    </Box>) : <Typography color={"#fff"}>{t("comment.noCmt")}</Typography>}
                            </Box>

                            <Box position={"relative"}>
                                <textarea
                                    className="comment-wrapper"
                                    name="content"
                                    variant="standard"
                                    margin="normal"
                                    placeholder={t("comment.placeholder")}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />

                                <Button className="btn" type="submit" sx={{
                                    position: "absolute",
                                    top: "0.375rem",
                                    right: 0
                                }}>
                                    <SendIcon />
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            )}

            {isModalOpen &&
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="modal__title"
                    aria-describedby="modal__content"
                >
                    <Box width={500} className="modal">
                        <Typography id="modal__title" variant="h6" component="h2" color={"#e50914"}>
                            {t("comment.modalTitle")}
                        </Typography>
                        <Typography id="modal__content" m={"16px 0"} color={"#fff"}>
                            {t("comment.modalContent")} <span style={{ color: "#ff0000" }}>
                                5 {t("header.ratingPoints").toLowerCase()}
                            </span>.
                        </Typography>

                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button
                                className="btn"
                                sx={{ mr: "0 !important" }}
                                onClick={() => handleDeleteComment(idCommentDeleted)}
                            >
                                {t("comment.ok")}
                            </Button>
                            <Button
                                className="btn"
                                sx={{
                                    bgcolor: "#2f3032 !important",
                                    "&:hover": { bgcolor: "rgba(81, 88, 99, 0.3) !important" }
                                }}
                                onClick={() => setIsModalOpen(false)}
                            >
                                {t("comment.cancel")}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            }
        </Box >
    )
}

export default MovieDetail