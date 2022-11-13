export interface User {
    _id: string
    username: string
    fullname: string
    email: string
    password: string
    imgUrl: string
    followers: miniUser[]
    following: miniUser[]
    savedPostsIds: string[]
    savedStoriesIds: string[]
}

export interface miniUser {
    _id: string
    fullname: string
    imgUrl: string
}


export interface UserFilter {
    term: string
}