import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Card, CardActionArea, CardMedia } from '@mui/material';
import { useToast } from 'hooks/useToast';
import { memo, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import {
  ClosedIcon,
  DropZoneContainer,
  DropzoneSectionHeading,
  ImagePickerContainer,
  MediaContainer,
} from './styled';

type Props = {
  limit: number;
  ImagesUrls: any;
  error?: string | string[];
  getFiles: (files: File[]) => void;
  deleteFile?: (idx: number) => void;
  clearFiles?: boolean;
  setFile?: any;
};

const ImagepickerComponent = ({
  error,
  limit,
  getFiles,
  ImagesUrls,
  deleteFile,
  clearFiles,
  setFile,
}: Props) => {
  const { Toast, handleClick } = useToast();
  const [files, setFiles] = useState<File[] | string[]>([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/bmp': ['.bmp'],
    },
    onDropRejected: rejectedFiles => {
      if (rejectedFiles[0].errors[0].code) {
        toast.error(
          `Unsupported file type. Allowed types are: ${[
            '.webp',
            '.png',
            '.gif',
            '.jpeg',
            '.bmp',
          ].join(', ')}.`,
        );
      }
    },
  });

  const deleteImage = (index: number) => {
    if (deleteFile) deleteFile(index);
    const updatedFiles = acceptedFiles.filter((item, idx) => index !== idx);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (!files.length) {
      setFiles(ImagesUrls);
    }
  }, [ImagesUrls]);

  useEffect(() => {
    if (clearFiles) {
      setFiles([]);
      setFile(false);
    }
  }, [clearFiles]);

  useEffect(() => {
    function toggleShow() {
      if (acceptedFiles && acceptedFiles.length > limit) {
        handleClick({
          level: 'error',
          message: `Cannot add more than ${limit} image${limit > 1 ? 's' : ''}`,
        });
      } else {
        setFiles([...acceptedFiles]);
        getFiles([...acceptedFiles]);
      }
    }
    toggleShow();

    return () => {};
  }, [acceptedFiles, handleClick, limit]);

  return (
    <ImagePickerContainer id="imagePicker" {...getRootProps()}>
      <DropZoneContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CloudUploadIcon />
          <input {...getInputProps()} />
          <p style={{ marginTop: '3px' }}>
            Drag and drop file or click to select
          </p>
        </div>
      </DropZoneContainer>
      <aside>
        {!files.length ? (
          <></>
        ) : (
          <>
            <DropzoneSectionHeading>File</DropzoneSectionHeading>
            <MediaContainer maxWidth="sm">
              {files.map((item, index) => (
                <Card key={index} style={{ width: '6rem' }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt="item"
                      src={
                        typeof item === 'string'
                          ? item
                          : URL.createObjectURL(item)
                      }
                      sx={{ mx: 2 }}
                    />
                    <span onClick={() => deleteImage(index)}>
                      <ClosedIcon />
                    </span>
                  </CardActionArea>
                </Card>
              ))}
            </MediaContainer>
          </>
        )}
      </aside>
      {error && (
        <label style={{ color: 'red', textAlign: 'center' }}>{error}</label>
      )}
      <Toast />
    </ImagePickerContainer>
  );
};

export const ImagePicker = memo(ImagepickerComponent);
