import "./PhotoItem.css";
import { Link } from "react-router-dom";
import LikeContainer from "./LikeContainer";

const PhotoItem = ({ photo, user, handleLike }) => {
  return (
    <div className="photo-item">
      {photo.image && <img src={photo.image} alt={photo.title} />}

      <h2>
        <Link to={`/photos/${photo.id}`} className="photo-title-link">
          {photo.title}
        </Link>
      </h2>

      <p className="photo-author">
        Publicada por:{" "}
        <Link
          to={`/users/${photo.user_id || photo.userId}`}
          className="author-name"
        >
          {photo.userName || photo.profiles?.name || "Usuário"}
        </Link>
      </p>

      <div className="photo-actions">
        <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      </div>

      <Link to={`/photos/${photo.id}`} className="btn-photo-item">
        Ver mais
      </Link>
    </div>
  );
};

export default PhotoItem;