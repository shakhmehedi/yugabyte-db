// Copyright (c) YugaByte, Inc.

import { connect } from 'react-redux';
import { BulkImport } from '../';
import { bulkImport, bulkImportResponse } from '../../../actions/tables';
import { reduxForm } from 'redux-form';

const mapDispatchToProps = (dispatch) => {
  return {
    bulkImport: (universeUUID, tableUUID, payload) => {
      dispatch(bulkImport(universeUUID, tableUUID, payload)).then((response) => {
        dispatch(bulkImportResponse(response.payload));
      });
    }
  }
};

function mapStateToProps(state) {
  return {
    universeDetails: state.universe.currentUniverse.data.universeDetails,
    currentTableDetail: state.tables.currentTableDetail
  };
}

function validate(values) {
  let errors = {};
  let hasErrors = false;
  if (!values.s3Bucket) {
    errors.s3Bucket = 'S3 bucket path required';
    hasErrors = true;
  } else if (!values.s3Bucket.startsWith('s3://')) {
    errors.s3Bucket = 'S3 bucket path must start with "s3://"';
    hasErrors = true;
  }
  if (values.instanceCount != undefined && parseInt(values.instanceCount) < 1) {
    errors.instanceCount = 'Must have at least 1 task instance for EMR job';
    hasErrors = true;
  }
  return hasErrors && errors;
}

let bulkImportForm = reduxForm({
  form: 'BulkImport',
  fields: ['s3Bucket', 'instanceCount'],
  validate
});

export default connect(mapStateToProps, mapDispatchToProps)(bulkImportForm(BulkImport));