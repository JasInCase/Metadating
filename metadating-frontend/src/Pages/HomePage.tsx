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
    profile_id: string // This needs to be updated to the match ID we get from the original get request
}


const getData = () => {
	const res = [];

	for (let i = 0; i < 13; i++) {
		res.push({
			profile_id: String(i),
			name: `Match ${i}`,
			real_convo_id: String(i),
			practice_convo_ids:[
				`${i}: Practice 1`,
				`${i}: Practice 2`
			]
		});
	}
	console.log(res);

	return res;
}

export async function sendMessageToAPI(profileId: string) {

    let userId = window.localStorage.getItem("userId");
    if (!userId) {
        userId = "";
    }

    const response = await axios.post('/api/v1/practice-conversation', {
        "profile_id": profileId, // Needs to be matchId
        "user_id": userId
    }, { headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        'content-type': 'application/json'
    }});
    
    // console.log(response);
    return response.data.practiceConversationId;

}

const Profile = (props: ProfileData) => {

    const addNewPracticeConvo = (profileId: string) => {

        sendMessageToAPI(profileId).then((practice_convo_id) => {

            window.location.assign(`/practice-conversation/${practice_convo_id}`);

        })

    }

	return (
		<Grid item xs={12} sm={6} md={4}>
			<Card variant="outlined">
				<CardContent>
					<Typography variant="h5" component="div">
						{props.name} - Match's NAME
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						<Link href={`/conversation/${props.real_convo_id}`} underline="hover">
							Real Conversation
						</Link>
					</Typography>
					<hr/>
					<Typography sx={{ mb: 1.5 }} color="text.secondary" className="pt-2">
						Practice with AI
					</Typography>
					<Typography variant="body2">
						{props.practice_convo_ids.map((convo_id, index) => {
							return (
								<div>
									<Link href={`/conversation/${convo_id}`} underline="hover">
										Practice Conversation {index}
									</Link>
								</div>
							)
						})}
                        <div className='text-green-500 rounded-xl border-2 p-2 mt-2 text-center hover:bg-green-200 hover:cursor-pointer' 
                        onClick={() => {addNewPracticeConvo(props.profile_id)}}>
                            <Typography variant="body2">
                                Add New Practice Conversation
                            </Typography>
                        </div>
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

const HomePage = () => {

    const formRedirect = () => {

        window.location.assign("/form");

    }

	return (
		<>
			<UserBadgeUpdated />
			<Grid container spacing={4} className="p-8 pt-25">
				{getData().map((profile) => {
					return (
						<Profile
							key={profile.profile_id}
							name={profile.name}
							real_convo_id={profile.real_convo_id}
							practice_convo_ids={profile.practice_convo_ids}
                            profile_id={profile.profile_id}

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