import React, {ChangeEvent, ChangeEventHandler, MouseEventHandler, useState} from 'react';
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
        <div className="div--centered" style={{ borderRadius: '10px'}}>
          <div style={{ border: '1px solid black', padding: '20px'}}>
            <label style={{color: 'lightgray'}}>Selected file</label>
            <div>{selectedFile.name}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', border: '1px solid black', padding: '20px'}}>
            <AiFillMinusCircle
              className="file-upload__remove-icon"
              title="Remove file"
              size="1.5em"
              onClick={onFileRemove}
            />
          </div>

        </div>
      ) : (
        <div>
          <p>Please upload the game file</p>
          <input className="btn-file" type="file" name="file" onChange={onFileChange} accept="application/json"/>
        </div>
      )}
    </div>
  )
}

export default FileUpload;