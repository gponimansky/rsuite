import React, { useCallback, useRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Ripple from '../Ripple';
import { isIE11, useClassNames } from '../utils';
import { UploaderLocale } from './Uploader';
export interface UploadTriggerProps {
  as: React.ElementType | string;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  accept?: string;
  classPrefix?: string;
  className?: string;
  children?: React.ReactNode;
  locale?: UploaderLocale;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onDragEnter?: React.DragEventHandler<HTMLInputElement>;
  onDragLeave?: React.DragEventHandler<HTMLInputElement>;
  onDragOver?: React.DragEventHandler<HTMLInputElement>;
  onDrop?: React.DragEventHandler<HTMLInputElement>;
}

export interface UploadTriggerInstance {
  clearInput: () => void;
}

const Button = props => <button {...props} type="button" />;

const defaultProps: Partial<UploadTriggerProps> = {
  as: Button,
  classPrefix: 'uploader-trigger'
};

const UploadTrigger = React.forwardRef((props: UploadTriggerProps, ref) => {
  const {
    as: Component,
    name,
    accept,
    multiple,
    disabled,
    children,
    classPrefix,
    className,
    draggable,
    locale,
    onChange,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>();
  const { merge, withClassPrefix, prefix } = useClassNames(classPrefix);
  const classes = merge(
    className,
    withClassPrefix({ disabled, customize: children, 'drag-over': dragOver })
  );

  const handleClick = useCallback(() => {
    !disabled && inputRef.current.click();
  }, [disabled]);

  const handleClearInput = useCallback(() => {
    inputRef.current.value = '';
  }, []);

  const handleDragEnter = useCallback(
    event => {
      if (draggable) {
        event.preventDefault();
        setDragOver(true);
      }
      onDragEnter?.(event);
    },
    [draggable, onDragEnter]
  );

  const handleDragLeave = useCallback(
    event => {
      if (draggable) {
        event.preventDefault();
        setDragOver(false);
      }
      onDragLeave?.(event);
    },
    [draggable, onDragLeave]
  );

  const handleDragOver = useCallback(
    event => {
      draggable && event.preventDefault();
      onDragOver?.(event);
    },
    [draggable, onDragOver]
  );

  const handleDrop = useCallback(
    event => {
      if (draggable) {
        event.preventDefault();
        setDragOver(false);
        onChange?.(event);
      }
      onDrop?.(event);
    },
    [draggable, onChange, onDrop]
  );

  const handleChange = useCallback(
    event => {
      if (isIE11()) {
        /**
         * IE11 triggers onChange event of file input when element.value is assigned
         * https://github.com/facebook/react/issues/8793
         */
        if (event.target?.files?.length > 0) {
          onChange?.(event);
        }
        return;
      }

      onChange?.(event);
    },
    [onChange]
  );

  useImperativeHandle(ref, () => ({
    root: rootRef.current,
    clearInput: handleClearInput
  }));

  const buttonProps = {
    ...rest,
    className: prefix('btn'),
    onClick: handleClick,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  };

  const trigger = children ? (
    React.cloneElement(React.Children.only(children as any), buttonProps)
  ) : (
    <Component {...buttonProps}>
      {locale?.upload}
      <Ripple />
    </Component>
  );

  return (
    <div ref={rootRef} className={classes}>
      <input
        type="file"
        name={name}
        multiple={multiple}
        disabled={disabled}
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
      />
      {trigger}
    </div>
  );
});

UploadTrigger.displayName = 'UploadTrigger';
UploadTrigger.defaultProps = defaultProps;
UploadTrigger.propTypes = {
  locale: PropTypes.object,
  name: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.elementType,
  draggable: PropTypes.bool,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
};

export default UploadTrigger;
