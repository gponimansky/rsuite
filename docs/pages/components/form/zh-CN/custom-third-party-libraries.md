### 兼容第三方组件

以 [text-mask](https://github.com/text-mask/text-mask) 为例：

<!--start-code-->

```js
const { ArrayType, StringType } = Schema.Types;
const model = Schema.Model({
  phone: StringType().isRequired('This field is required.')
});

const InputMask = ({ onChange, ...rest }) => {
  return (
    <MaskedInput
      {...rest}
      className="rs-input"
      onChange={event => {
        onChange(event.target.value);
      }}
    />
  );
};

class CustomField extends React.PureComponent {
  render() {
    const { name, message, label, accepter, error, ...props } = this.props;
    return (
      <Form.Group className={error ? 'has-error' : ''}>
        <Form.ControlLabel>{label} </Form.ControlLabel>
        <Form.Control name={name} accepter={accepter} errorMessage={error} {...props} />
        <Form.HelpText>{message}</Form.HelpText>
      </Form.Group>
    );
  }
}

class CustomFieldForm extends React.Component {
  constructor(props) {
    super(props);
    const formValue = {
      phone: ''
    };
    this.state = {
      formValue: formValue,
      formError: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    const { formValue } = this.state;
    if (!this.form.check()) {
      Alert.error('Error');
      return;
    }
    Alert.success('Success');
  }
  render() {
    const { formError, formValue } = this.state;

    return (
      <div>
        <JSONView formValue={formValue} formError={formError} />
        <Form
          ref={ref => (this.form = ref)}
          onChange={formValue => {
            console.log(formValue);
            this.setState({ formValue });
          }}
          onCheck={formError => {
            console.log(formError, 'formError');
            this.setState({ formError });
          }}
          formDefaultValue={formValue}
          model={model}
        >
          <CustomField
            name="phone"
            label="Phone Number"
            mask={[
              '(',
              /[1-9]/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/
            ]}
            accepter={InputMask}
            error={formError.phone}
          />

          <Form.Group>
            <Button appearance="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

ReactDOM.render(<CustomFieldForm />);
```

<!--end-code-->
