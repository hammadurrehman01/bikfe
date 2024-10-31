import { AxiosResponse } from 'axios';
import CurrencyList from 'currency-list';

export const errorResponse = (error: unknown) => {
  return {
    hasError: true,
    error: error,
  };
};

export const errorResponseWithData = (message: string, error: object) => {
  return {
    hasError: true,
    message: message,
    error: error,
  };
};

export const successResponse = (message: string) => {
  return {
    hasError: false,
    message: message,
  };
};

export const successResponseWithData = (
  message: string | number,
  data: any,
) => {
  return {
    hasError: false,
    message: message,
    data: data,
  };
};

export const currencies = () => {
  const allCurrencies = CurrencyList.getAll('en_US');
  const currencyOptions = Object.keys(allCurrencies).map(code => {
    const currency = allCurrencies[code];
    return `${code}-${currency.name}`;
  });
  return currencyOptions ?? [];
};

export const downloadExcel = (response: AxiosResponse, name: string) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.download;
  link.href = url;
  link.setAttribute('download', `${name}.xlsx`);
  document.body.appendChild(link);
  link.click();
};

export const PrismaErrorCode = (error: any) => {
  switch (error.code) {
    case 'P1000':
      throw new Error(
        'Unable to connect to the database. Please check your login details and try again.',
      );
    case 'P1001':
      throw new Error(
        "Couldn't reach the database. Make sure it's running and accessible.",
      );
    case 'P1002':
      throw new Error(
        'Connection to the database timed out. Please try again later.',
      );
    case 'P1003':
      throw new Error(
        'The database file could not be found. Please check the file location and try again.',
      );
    case 'P1008':
      throw new Error('The request took too long. Please try again.');
    case 'P1009':
      throw new Error(
        'The database already exists. No need to create it again.',
      );
    case 'P1010':
      throw new Error(
        'Access denied. You do not have permission to use this database.',
      );
    case 'P1011':
      throw new Error(
        'There was an issue with a secure connection. Please try again.',
      );
    case 'P1012':
      throw new Error('There was an issue with the database configuration.');
    case 'P1013':
      throw new Error(
        'The provided database connection details are incorrect.',
      );
    case 'P1014':
      throw new Error(
        'A required part of the database is missing. Please check your database setup.',
      );
    case 'P1015':
      throw new Error(
        'The database version is not supported by the current system. Please update or check compatibility.',
      );
    case 'P1016':
      throw new Error('An error occurred while processing your request.');
    case 'P1017':
      throw new Error('The server unexpectedly closed the connection.');
    case 'P2000':
      throw new Error('The value you entered is too long. Please shorten it.');
    case 'P2001':
      throw new Error('The requested record was not found.');
    case 'P2002':
      throw new Error('A record with this value already exists.');
    case 'P2003':
      throw new Error(
        'A related record could not be found. Please check your input.',
      );
    case 'P2004':
      throw new Error('An error occurred while processing the data.');
    case 'P2005':
      throw new Error('The stored data is not valid. Please contact support.');
    case 'P2006':
      throw new Error(
        'The input value is not valid. Please check and try again.',
      );
    case 'P2007':
      throw new Error('There was a data validation error. Please try again.');
    case 'P2008':
      throw new Error(
        'An error occurred while processing the query. Please try again later.',
      );
    case 'P2009':
      throw new Error(
        'The query validation failed. Please check your request.',
      );
    case 'P2010':
      throw new Error('The request failed. Please try again.');
    case 'P2011':
      throw new Error('A required field is missing.');
    case 'P2012':
      throw new Error('A required value is missing.');
    case 'P2013':
      throw new Error(
        'A required argument is missing. Please check your input.',
      );
    case 'P2014':
      throw new Error(
        'The change you are trying to make would break the relationship between records.',
      );
    case 'P2015':
      throw new Error('A related record could not be found.');
    case 'P2016':
      throw new Error('An error occurred while interpreting the query.');
    case 'P2017':
      throw new Error(
        'The records are not properly connected. Please check your data.',
      );
    case 'P2018':
      throw new Error('Required connected records were not found.');
    case 'P2019':
      throw new Error('There was an input error. Please try again.');
    case 'P2020':
      throw new Error('The value is out of range. Please try again.');
    case 'P2021':
      throw new Error('The specified table does not exist.');
    case 'P2022':
      throw new Error('The specified column does not exist.');
    case 'P2023':
      throw new Error('There was an issue with the data in the column.');
    case 'P2024':
      throw new Error(
        'The request took too long to connect. Please try again later.',
      );
    case 'P2025':
      throw new Error(
        'A required record could not be found. Please check your input.',
      );
    case 'P2026':
      throw new Error('The database provider does not support this feature.');
    case 'P2027':
      throw new Error('Multiple errors occurred during the query execution.');
    case 'P2028':
      throw new Error('There was an error with the transaction.');
    case 'P2029':
      throw new Error('The query contains too many parameters.');
    case 'P2030':
      throw new Error('No search index found. Please contact support.');
    case 'P2031':
      throw new Error(
        'A MongoDB server needs to be run as a replica set for transactions.',
      );
    case 'P2033':
      throw new Error('A number in the query is too large. Please try again.');
    case 'P2034':
      throw new Error(
        'The transaction failed due to a conflict. Please try again.',
      );
    case 'P2035':
      throw new Error('There was a database error. Please contact support.');
    case 'P2036':
      throw new Error('There was an error with an external system.');
    case 'P2037':
      throw new Error('Too many database connections are open.');
    case 'P3000':
      throw new Error('Could not create the database.');
    case 'P3001':
      throw new Error(
        'Migration may cause data loss. Please proceed with caution.',
      );
    case 'P3002':
      throw new Error('Migration failed and was rolled back.');
    case 'P3003':
      throw new Error(
        'The migration format has changed. Please follow the provided instructions.',
      );
    case 'P3004':
      throw new Error('System databases cannot be altered.');
    case 'P3005':
      throw new Error('The database is not empty.');
    case 'P3006':
      throw new Error('Migration failed to apply to the database.');
    case 'P3007':
      throw new Error('Some features are not allowed. Please remove them.');
    case 'P3008':
      throw new Error('The migration is already applied.');
    case 'P3009':
      throw new Error(
        'Failed migrations were found. Please resolve the issue.',
      );
    case 'P3010':
      throw new Error('Migration name is too long. Please shorten it.');
    case 'P3011':
      throw new Error('Migration not found.');
    case 'P3012':
      throw new Error('Migration is not in a failed state.');
    case 'P3013':
      throw new Error('Datasource provider arrays are not supported.');
    case 'P3014':
      throw new Error('Could not create the shadow database.');
    case 'P3015':
      throw new Error('Migration file could not be found.');
    case 'P3016':
      throw new Error('Database cleanup failed.');
    case 'P3017':
      throw new Error('Migration could not be found.');
    case 'P3018':
      throw new Error('Migration failed. Please resolve the issue.');
    case 'P3019':
      throw new Error(
        'Datasource provider mismatch. Please reset your migration history.',
      );
    case 'P3020':
      throw new Error(
        'Automatic creation of shadow databases is disabled on Azure SQL.',
      );
    case 'P3021':
      throw new Error('Foreign keys cannot be created on this database.');
    case 'P3022':
      throw new Error('Direct SQL execution is disabled.');
    case 'P4000':
      throw new Error('Could not generate the schema.');
    case 'P4001':
      throw new Error('The database is empty.');
    case 'P4002':
      throw new Error('Database schema is inconsistent.');
  }
};
