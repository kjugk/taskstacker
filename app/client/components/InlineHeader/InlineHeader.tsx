import * as React from 'react';
import * as types from '../../types';
import styled from 'styled-components';
import key from 'keymaster';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { InlineHeaderUserMenu } from './InlineHeaderUserMenu/InlineHeaderUserMenu';
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive';

const Content = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  min-width: 36px;
`;

const UserName = styled.div`
  flex: 1;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const Chevron = styled<{ open: boolean }, any>(Icon)`
  margin-left: 0.5rem !important;
  transform: rotate(0);
  transition: transform 0.2s ease;
  ${(props) => props.open && 'transform: rotate(-180deg)'};
`;

interface Props {
  user: types.UserState;
  onSignOutClick(): any;
}

interface State {
  openMenu: boolean;
}

class InlineHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      openMenu: false
    };
  }

  componentDidMount() {
    key('esc', this.closeMenu);
    window.addEventListener('click', this.closeMenu);
  }

  componentWillUnmount() {
    key.unbind('esc');
    window.removeEventListener('click', this.closeMenu);
  }

  render() {
    const { user, onSignOutClick } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <Content
          onClick={(e) => {
            e.stopPropagation();
            this.setState((prevState) => ({
              openMenu: !prevState.openMenu
            }));
          }}
        >
          <Avatar>
            <Image src={user.imageUrl} avatar size="mini" />
          </Avatar>
          <Responsive minWidth={768} as={() => <UserName>{user.name}</UserName>} />
          <Chevron name="chevron down" open={this.state.openMenu} />
        </Content>
        <InlineHeaderUserMenu open={this.state.openMenu} onSignOutClick={onSignOutClick} />
      </div>
    );
  }

  private closeMenu() {
    this.setState(() => ({
      openMenu: false
    }));
  }
}

export { InlineHeader };
