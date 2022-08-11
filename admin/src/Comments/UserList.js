import React from 'react';
import styled from 'styled-components';
import User from './User';

const List = styled.ul`
	display: inline-block;
`;

const ListItem = styled.li`
	display: inline-block;
	margin-right: 16px;
`;

class UserList extends React.Component {

	render() {
		return (
			<List>
				{ this.props.userIds.map( id => (
					<ListItem key={ id }>
						<User userId={ id } />
					</ListItem>
				) ) }
			</List>
		);
	}

}

export default UserList;
