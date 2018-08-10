import * as React from 'react';
import * as types from '../../../types';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';

const Title = styled<{ completed: boolean }, any>('h2')`
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  overflow: hidden;
  word-break: break-word;
  margin-right: 1rem;
  ${(props) => props.completed && 'text-decoration: line-through; color: #ccc'};
`;

interface TaskTitleProps {
  task: types.TaskState;
  onSubmit(id: number, params: any): any;
}

interface TaskTitleState {
  title: string;
  isEditing: boolean;
}

class TaskTitle extends React.Component<TaskTitleProps, TaskTitleState> {
  private input: any;

  constructor(props: TaskTitleProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      title: props.task.title,
      isEditing: false
    };
  }

  componentDidUpdate(prevProps: TaskTitleProps, prevState: TaskTitleState) {
    // 選択済みtask が変更された場合
    if (prevProps.task.id !== this.props.task.id && this.props.task) {
      const title = this.props.task.title;
      this.setState({
        title,
        isEditing: false
      });
    }

    if (!prevState.isEditing && this.state.isEditing) {
      if (this.input) {
        this.input.focus();
      }
    }
  }

  render() {
    const { title, isEditing } = this.state;

    return (
      <div style={{ flex: 1 }}>
        {isEditing && this.renderInput()}
        {!isEditing && (
          <Title completed={this.props.task.completed} onClick={this.handleEdit}>
            {title}
          </Title>
        )}
      </div>
    );
  }

  private renderInput() {
    return (
      <Input
        ref={(r: any) => (this.input = r)}
        style={{ width: '100%' }}
        size="mini"
        value={this.state.title}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) {
            this.handleSubmit();
            return;
          }
          if (e.keyCode === 27) {
            this.handleCancel();
            return;
          }
        }}
        onChange={(e: any) => {
          const value = e.currentTarget.value;
          this.setState(() => ({ title: value }));
        }}
        onBlur={this.handleSubmit}
      />
    );
  }

  private handleSubmit() {
    if (this.state.title.trim() === '') {
      this.handleCancel();
      return;
    }

    if (this.state.title !== this.props.task.title) {
      this.props.onSubmit(this.props.task.id, { title: this.state.title });
    }

    this.setState(() => ({ isEditing: false }));
  }

  private handleEdit() {
    this.setState(() => ({ isEditing: true }));
  }

  private handleCancel() {
    this.setState((prevState, props) => ({ title: props.task.title, isEditing: false }));
  }
}

export { TaskTitle };
