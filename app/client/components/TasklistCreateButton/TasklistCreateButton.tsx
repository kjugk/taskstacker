import * as React from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';

interface Props {
  onClick(): any;
}

const TasklistCreateButton: React.SFC<Props> = (props: Props) => {
  return (
    <Button
      content="リストを作成"
      fluid
      icon="plus"
      size="huge"
      style={{ borderRadius: 0 }}
      onClick={props.onClick}
    />
  );
};

export { TasklistCreateButton };
