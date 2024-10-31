import styled from '@emotion/styled';
import { Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const DropZoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export const ImagePickerContainer = styled.section`
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  padding: 16px;
  border: 1px solid rgb(232, 232, 232);
  border-radius: 3px;
  width: 100%;
  margin-bottom: 1rem;
`;

export const DropzoneSectionHeading = styled.h4`
  margin-top: 0.5rem;
`;

export const MediaContainer = styled(Container)`
  display: flex !important;
  flex-flow: row wrap;
`;

export const ClosedIcon = styled(CloseIcon)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: large;
  color: white;
  background-color: red;
  padding: 0.1rem 0.2rem;
  border-radius: 100%;
`;
