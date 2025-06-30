import logging


class LoggerConfig:

    def __init__(self, name: str):
        """
        Initializes and returns a logger with the given name.
        """
        self.__logger = logging.getLogger(name)
        self.__logger.addHandler(self.__get_handler())
        self.__logger.addHandler(self.__get_file_handler())
        self.__logger.setLevel(logging.INFO)

    @staticmethod
    def __get_formatter() -> logging.Formatter:
        """
        Returns a logging formatter object.
        """
        return logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    def __get_handler(self) -> logging.Handler:
        """
        Returns a logging handler object.
        """
        handler = logging.StreamHandler()
        handler.setFormatter(self.__get_formatter())
        return handler

    def __get_file_handler(self) -> logging.Handler:
        """
        Returns a logging file handler object.
        """
        import os
        # Use /app/logs/app.log if in container, otherwise use relative path
        log_path = '/app/logs/app.log' if os.path.exists('/app/logs') else 'app.log'
        handler = logging.FileHandler(log_path)
        handler.setFormatter(self.__get_formatter())
        return handler

    def get_logger(self):
        return self.__logger
