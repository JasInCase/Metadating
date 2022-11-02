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


type ProfileData = {
	name: string,
	real_convo_id: string,
	practice_convo_ids: string[]
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


const Profile = (props: ProfileData) => {

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
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

const HomePage = () => {
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
						/>
					);
				})}
			</Grid>
		</>
	);
};

export default HomePage;