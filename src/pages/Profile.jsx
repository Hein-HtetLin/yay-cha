import {Avatar,Box,Typography} from "@mui/material";
import {pink} from "@mui/material/colors";

import Item from "../components/Item";

import { useParams } from "react-router-dom";
import { fetchUser } from "../libs/fetcher";
import { useQuery } from "react-query";
import FollowButton from "../components/FollowButton";


export default function Profile(){
    const {id} = useParams();
    // const data = fetchUser(id)
    const {isLoading,isError,error,data} = useQuery(
        "profile",async()=>fetchUser(id)
    )

    // console.log(data)

    if(isError){
        return(
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        )
    }

    if(isLoading){
        return <Box sx={{textAlign:"center"}}>Loading...</Box>
    }
    return(
        <Box>
            <Box sx={{bgcolor:"banner" ,height:150,borderRadius:4}}></Box>
                <Box sx={{mb:4,
                    marginTop:"-60px",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    gap:1}}>
                        <Avatar sx={{width:100,height:100,bgcolor:pink[500]}} />
                        <Box sx={{textAlign:"center"}}>
                            <Typography>{data.name}</Typography>
                            <Typography sx={{fontSize:"0.8em",color:"text.fade"}}>
                                {data.bio}
                            </Typography>
                            <FollowButton user={data}/>
                        </Box>
                </Box>
        </Box>
    )
}