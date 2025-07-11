from app.models import Like, Dislike


def is_liked(from_user_id, to_user_id):
    previous_likes = Like.query.where(
        Like.from_user_id == from_user_id,
        Like.to_user_id == to_user_id
    )

    return True if previous_likes else False


def is_disliked(from_user_id, to_user_id):
    previous_dislikes = Dislike.query.where(
        Dislike.from_user_id == from_user_id,
        Dislike.to_user_id == to_user_id
    )

    return True if previous_dislikes else False


def available_to_act(from_user_id, to_user_id):
    liked = is_liked(from_user_id, to_user_id)
    disliked = is_disliked(from_user_id, to_user_id)

    return liked or disliked
