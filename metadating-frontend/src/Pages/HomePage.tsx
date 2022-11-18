import React from 'react';
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Link,
} from "@mui/material";
import UserBadge from '../CommonComponents/UserBadge';
import UserBadgeUpdated from '../CommonComponents/UserBadgeUpdated';
import internal from 'stream';
import axios from 'axios';


type ProfileData = {
	name: string,
	real_convo_id: string,
	practice_convo_ids: string[],
    profile_id: string, // This needs to be updated to the match ID we get from the original get request
    match_id: string
}


const getData = async () => {
    
    let userId = window.localStorage.getItem("userId");

    // axios.get(`/api/v1/matches/${userId}`, {
    const response = await axios.get(`/api/v1/matches/${userId}`, {
    // const response = await axios.get(`/api/v1/matches/6362be4b232ed7fb4791d53e`, {
        headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            'content-type': 'application/json',
        }
    });
    
    // console.log("Request response:")
    // console.log(response.data.matches);
    return response.data.matches;

	// const res = [];

	// for (let i = 0; i < 13; i++) {
	// 	res.push({
	// 		profile_id: String(i),
	// 		name: `Match ${i}`,
	// 		real_convo_id: String(i),
	// 		practice_convo_ids:[
	// 			`${i}: Practice 1`,
	// 			`${i}: Practice 2`
	// 		]
	// 	});
	// }
	// console.log(res);

	// return res;
	// return res;
}

export async function sendMessageToAPI(matchId: string) {

    let userId = window.localStorage.getItem("userId");
    if (!userId) {
        userId = "";
    }

    const response = await axios.post('/api/v1/practice-conversation', {
        "matchId": matchId, // Needs to be matchId
        "userId": userId
    }, { headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        'content-type': 'application/json'
    }});
    
    // console.log(response);
    return response.data.practiceConversationId;

}

const Profile = (props: ProfileData) => {

    const addNewPracticeConvo = (match_id: string) => {

        sendMessageToAPI(match_id).then((practice_convo_id) => {

            window.location.assign(`/practice-conversation/${practice_convo_id}`);

        })

    }

	return (
		<Grid item xs={12} sm={6} md={4}>
			<Card variant="outlined">
				<CardContent>
                    <div className='text-pink-500 pb-2'>
                        <Typography variant="h5" component="div">
                            {props.name}
                        </Typography>
                    </div>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						<Link href={`/conversation/${props.real_convo_id}`} underline="hover">
							Real Conversation
						</Link>
					</Typography>
					<hr/>
                    <div className='pb-1'>
                        <Typography variant="body2">
                            {props.practice_convo_ids.map((convo_id, index) => {
                                return (
                                    <Link href={`/conversation/${convo_id}`} underline="hover">
                                        Practice Conversation {index}
                                    </Link>
                                )
                            })}
                        </Typography>
                    </div>
                    <div className='text-green-500 rounded-xl border-2 p-2 mt-2 text-center hover:bg-green-200 hover:cursor-pointer' 
                    onClick={() => {addNewPracticeConvo(props.match_id)}}>
                        <Typography variant="body2">
                            Add New Practice Conversation
                        </Typography>
                    </div>
				</CardContent>
			</Card>
		</Grid>
	);
}

const HomePage = () => {

    const [profileData, setProfileData] = React.useState<any[]>([]);
    const [randomVar, setRandomVar] = React.useState("");

    const formRedirect = () => {

        window.location.assign("/form");

    }

    React.useEffect(() => {

        getData().then((response) => {

            let matchesArray : any = []
            for (const [key, resObject] of response.entries()) {

                let matchObject : any = {};

                matchObject['profile_id'] = resObject.match.user_id;
                matchObject['name'] = resObject.match.name;
                matchObject['real_convo_id'] = resObject.real_conversation;
                matchObject['practice_convo_ids'] = resObject.practice_conversations;
                matchObject['match_id'] = resObject.match._id.$oid;
                matchObject['user_id'] = resObject.match.user_id;

                matchesArray.push(matchObject);

            }

            // console.log("Matches Array:")
            // console.log(matchesArray)
            setProfileData(matchesArray);
        });

    }, [randomVar]);

	return (
		<>
			<UserBadgeUpdated />
			<Grid container spacing={4} className="p-8 pt-25">
				{/* {getData().map((profile) => { */}
				{profileData.map((profile) => {
					return (
						<Profile
							key={profile.match_id}
							name={profile.name}
							real_convo_id={profile.real_convo_id}
							practice_convo_ids={profile.practice_convo_ids}
                            profile_id={profile.profile_id}
                            match_id={profile.match_id}

						/>
					);
				})}

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" onClick={formRedirect} className="hover:cursor-pointer hover:bg-slate-100">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Add New Match
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

			</Grid>
		</>
	);
};

export default HomePage;