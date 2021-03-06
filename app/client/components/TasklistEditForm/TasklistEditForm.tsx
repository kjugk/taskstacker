import * as React from 'react';
import * as types from '../../types';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import Dimmer from 'semantic-ui-react/dist/commonjs/modules/Dimmer';
import Transition from 'semantic-ui-react/dist/commonjs/modules/Transition/Transition';
import { TasklistForm } from '../TasklistForm/TasklistForm';

interface Props {
  formState: types.TasklistEditFormState;
  tasklist: types.TasklistState;
  onChangeTitle(title: string): any;
  onDestroyTasklist(id: number): any;
  onSubmit(): any;
  onClose(): any;
}

interface State {
  open: boolean;
}

/**
 * Tasklist 編集フォーム
 */
class TasklistEditForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState(() => ({
      open: true
    }));
  }

  render() {
    const { formState, onChangeTitle, onDestroyTasklist, onSubmit, onClose } = this.props;

    return (
      <Transition
        animation="scale"
        duration={180}
        unmountOnHide={true}
        visible={this.state.open}
        onHide={onClose}
      >
        <Modal
          centered={false}
          closeOnEscape={!formState.isSubmitting}
          closeOnDimmerClick={!formState.isSubmitting}
          open={true}
          size="tiny"
          onClose={this.handleClose}
        >
          <Modal.Header>
            <div style={{ fontWeight: 400 }}>リストを編集</div>
          </Modal.Header>
          <Modal.Content>
            {formState.isSubmitting && (
              <Dimmer active>
                <Loader inline="centered">更新中...</Loader>
              </Dimmer>
            )}

            <TasklistForm
              canDestroy={true}
              title={formState.title}
              onChangeTitle={onChangeTitle}
              onClickClose={this.handleClose}
              onSubmit={onSubmit}
              onClickDestroy={() => {
                if (window.confirm('本当に削除しますか?')) {
                  onDestroyTasklist(formState.id);
                }
              }}
            />
          </Modal.Content>
        </Modal>
      </Transition>
    );
  }

  private handleClose() {
    this.setState(() => ({ open: false }));
  }
}

export { TasklistEditForm };
