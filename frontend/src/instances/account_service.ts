import AccountService from '../services/AccountService';
import logging_service from './logging_service';
import authorization_service from './authorization_service';

const account_service = new AccountService({
    logging_service,
    authorization_service,
});

export default account_service;
