import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {AiFillMinusCircle} from 'react-icons/all';
import './FileUpload.css';

interface FileUploadProps {
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onFileRemove: MouseEventHandler<SVGAElement>;
  selectedFile: File | null;
}

const FileUpload = ({selectedFile, onFileChange, onFileRemove}: FileUploadProps) => {
  return (
    <div>
      {selectedFile ? (
        <div className="file-upload__upload-div div--centered">
          <div className="div--margin-right">
            <label className="file-upload__label">Selected file</label>
            <div>{selectedFile.name}</div>
          </div>
          <div className="div--centered">
            <AiFillMinusCircle
              className="file-upload__remove-icon"
              title="Remove file"
              size="1.5em"
              onClick={onFileRemove}
            />
          </div>

        </div>
      ) : (
        <div className="file-upload__upload-div div--centered">
          <input className="file-upload__input" type="file" name="file" onChange={onFileChange} accept="application/json"/>
        </div>
      )}
    </div>
  )
}

export default FileUpload;