// @flow

import React, { Component } from 'react';
import type { ElementType } from 'react';
import { Loader } from 'semantic-ui-react';

type Props = {
  load: () => void,
  shouldLoad: boolean,
  Child: ElementType
};

class PreloadContainer extends Component<Props> {
  componentDidMount() {
    const { load, shouldLoad } = this.props;
    if (shouldLoad) {
      load();
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
