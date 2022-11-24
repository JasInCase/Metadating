import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';

const MetadatingHeader = ({prefixText}: {prefixText: string}) => {
	return (
		<Grid
			container
			spacing={0}
			direction="row"
			alignItems="center"
			justifyContent="center"
			className="pb-5"
        >
			<Grid>
				<Typography
				className="pt-3 pb-1"
				variant="h3"
				component="h3"
				align="center"
				>
					{prefixText}
				</Typography>
			</Grid>
			<Grid className="pt-2 pl-2">
				<img src="metadating.png" alt="Metadating" style={{ height: "60px" }} />
			</Grid>
        </Grid>
	)
}

export default MetadatingHeader;