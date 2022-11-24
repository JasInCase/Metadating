import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';

const CompanyTag = () => {
	return (
		<Grid
			container
			spacing={0}
			direction="row"
			alignItems="center"
			justifyContent="center"
        >
			<Grid>
				<Typography
					className="pt-0 pb-1 pr-1"
					variant="subtitle1"
					component="div"
					display="flex"
					align="center"
				>
					Powered by 
					
				</Typography>
			</Grid>
			<Grid>
				<img src="jasincase.png" alt="jASiNcase" className="pb-1" style={{ height: '25px' }} />
			</Grid>
		</Grid>
	)
}

export default CompanyTag;
