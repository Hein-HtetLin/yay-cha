import { useState,useEffect } from "react";
import {Box, Typography,Button} from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
 import {useApp} from "../ThemedApp";
 import { useQuery,useMutation } from "react-query";
 import {queryClient} from "../ThemedApp"
import { postPost,fetchFollowingPosts, fetchPosts,deletePost } from "../libs/fetcher";

const api = import.meta.env.VITE_API
// console.log(api)
export default function Home(){
    const [showLatest,setShowLatest] = useState(true)


    const {showForm,auth,setGlobalMsg} = useApp();
    const {isLoading,isError,error,data} = useQuery(["posts",showLatest],async()=>{
        if(showLatest) return fetchPosts()
        else return fetchFollowingPosts()
        // console.log(res.json());
    })
    // console.log(auth)
    

    const remove = useMutation(
        async id => deletePost(id),{
            onMutate:id=>{
                queryClient.cancelQueries("posts");
                queryClient.setQueryData(["posts",showLatest],old => old.filter(item => item.id !== id));
                setGlobalMsg("A post deleted")
            }
        })

        const add = useMutation(async content=>postPost(content),{
            onSuccess:async post =>{
                await queryClient.cancelQueries("posts");
                await queryClient.setQueriesData(["posts",showLatest], old =>[post, ...old]);
                setGlobalMsg("A post Add")
            }
        })
    
        
    if(isError){
       return(
        <Box>
            <Alert severity="warning">{error.message}</Alert>
        </Box>
       ) 
    }
    if(isLoading){
        return <Box sx={{textAlign:"center"}}>Loading</Box>
    }
    return(
        <Box>
            {showForm && auth && <Form add={add}/>}
            
            {auth && (
                <Box
                    sx={{display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        mb:1
                    }}
                >
                <Button disabled={showLatest} onClick={()=>setShowLatest(true)}>
                    Latest
                </Button>
                <Typography sx={{color:"text.fade" , fontSize:15}}> | </Typography>
                <Button disabled={!showLatest} onClick={()=>setShowLatest(false)}>
                    Following
                </Button>
                </Box>
            )}

            {data.map(item => {
                return (
                    <Item key={item.id} item={item} remove={remove.mutate} />
                )
            })}
        </Box>
    )
}