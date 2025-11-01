import "./LikeContainer.css";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeContainer = ({ photo, user, handleLike }) => {
  const liked =
    photo.likes &&
    user &&
    user.user &&
    photo.likes.some((like) => like.user_id === user.user.id);

  return (
    <div className="like">
      {photo.likes && user && (
        <>
          <button
            onClick={() => handleLike(photo)}
            aria-label={liked ? "Remover curtida" : "Curtir foto"}
          >
            {liked ? <BsHeartFill className="liked" /> : <BsHeart />}
          </button>

          <span className="like-count">
            {photo.likes.length}{" "}
            {photo.likes.length === 1 ? "curtida" : "curtidas"}
          </span>
        </>
      )}
    </div>
  );
};

export default LikeContainer;