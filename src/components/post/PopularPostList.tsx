import { useEffect, useState } from "react";
import type { Post } from "../../types/post.type.ts";
import postApi from "../../api/user/postApi.ts";
import {
    PopularPostListHeader,
    PopularPostListLiWrapper,
    PopularPostListSection,
    PostContainer,
} from "./post.style.tsx";
import { Link } from "react-router";

interface Props {
    categoryId: number;
}

function PopularPostList({ categoryId }: Props) {
    const [list, setList] = useState<Post[]>([]);

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await postApi.fetchPopularPostList(categoryId);
                setList(data);
            } catch (error) {
                console.log(error);
            }
        };
        loadList().then(() => {});
    }, [categoryId, setList]);


    return (
        <PostContainer>
            <PopularPostListHeader>인기글 Top 5</PopularPostListHeader>
            <PopularPostListSection>
                <ul>
                    {list.map(item => (
                        <PopularPostListLiWrapper key={item.id}>
                            <Link to={`/post/${item.id}`}>
                                <li>{item.title}</li>
                            </Link>
                            <span>{item.user?.nickname}</span>
                        </PopularPostListLiWrapper>
                    ))}
                </ul>
            </PopularPostListSection>
        </PostContainer>
    );
}

export default PopularPostList;
