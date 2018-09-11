// @flow

import React, { Component } from 'react';
import type { ElementType } from 'react';
import { Loader } from 'semantic-ui-react';

type Props = {
  load: (args: mixed) => void,
  shouldLoad: boolean,
  Child: ElementType,
  loadArgs: mixed
};

class PreloadContainer extends Component<Props> {
  componentDidMount() {
    const { load, shouldLoad, loadArgs } = this.props;
    if (shouldLoad) {
      load(loadArgs);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { load, shouldLoad } = nextProps;
    if (shouldLoad && shouldLoad !== this.props.shouldLoad) {
      load();
    }
  }

  render() {
    const { shouldLoad, Child, ...rest } = this.props;
    if (shouldLoad) {
      return <Loader active />;
    }
    return <Child {...rest} />;
  }
}

export default PreloadContainer;
