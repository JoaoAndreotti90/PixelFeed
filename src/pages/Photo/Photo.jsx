import "./Photo.css";
import Message from "../../components/Message";
import LikeContainer from "../../components/LikeContainer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { getPhoto, like, comment } from "../../slices/photoSlice";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error } = useSelector((state) => state.photo);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getPhoto(id));
    }
  }, [dispatch, id]);

  const handleLike = () => {
    if (photo.id) {
      dispatch(like(photo.id));
      resetMessage();
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!photo.id || !commentText) return;
    const photoData = { comment: commentText, id: photo.id };
    dispatch(comment(photoData));
    setCommentText("");
    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error || !photo.id) {
    return (
      <div id="photo">
        <h2 className="error">Foto não encontrada.</h2>
        {error && <Message msg={error} type="error" />}
      </div>
    );
  }

  return (
    <div id="photo">
      <div className="photo-display">
        {photo.image && <img src={photo.image} alt={photo.title} />}

        <h2 className="photo-title-detail">{photo.title}</h2>

        <p className="photo-author-detail">
          Publicada por:
          <Link
            to={`/users/${photo.user_id}`}
            className="author-name-detail"
          >
            {photo.userName}
          </Link>
        </p>

        <div className="photo-actions-detail">
          <LikeContainer photo={photo} user={user} handleLike={handleLike} />
        </div>
      </div>

      {error && (
        <div className="message-container">
          <Message msg={error} type="error" />
        </div>
      )}

      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários ({photo.comments.length}):</h3>

            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                placeholder="Insira seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
              />
              <input type="submit" value="Enviar" />
            </form>

            {photo.comments.length === 0 && <p>Não há comentários...</p>}

            <div className="comment-list">
              {photo.comments.map((comment, i) => (
                <div className="comment" key={i}>
                  <div className="author">
                    {comment.userImage ? (
                      <img src={comment.userImage} alt={comment.userName} />
                    ) : (
                      <div className="author-placeholder"></div>
                    )}
                    <Link to={`/users/${comment.user_id}`}>
                      <p className="author-name">{comment.userName}</p>
                    </Link>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;