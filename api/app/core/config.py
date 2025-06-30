import os
from dotenv import load_dotenv, dotenv_values

class AppConfig:
    """
    A class to encapsulate application configuration.
    """

    def __init__(self, env_file='../.env'):
        """
        Initializes the AppConfig with default values for configuration settings.
        """
        self.env_file = env_file
        load_dotenv(self.env_file)
        self.configs = dotenv_values(self.env_file)
        
        # If .env file doesn't exist or is empty, fall back to environment variables
        if not self.configs:
            self.configs = dict(os.environ)

    def load_configs(self):
        """
        Loads configuration settings from the .env file into the current environment.
        """
        self.configs = dotenv_values(self.env_file)
        
        # If .env file doesn't exist or is empty, fall back to environment variables
        if not self.configs:
            self.configs = dict(os.environ)

    def save_config(self):
        """
        Saves the current configuration settings to the .env file.
        """
        with open(self.env_file, 'w') as configfile:
            for key, value in self.configs.items():
                configfile.write(f"{key}={value}\n")

    def set(self, option, value):
        """
        Sets a configuration value and saves it to the .env file.
        """
        self.configs[option.upper()] = str(value)
        self.save_config()
        self.load_configs()

    @staticmethod
    def _to_bool(value):
        """
        Converts a string value to a boolean.
        """
        if value is None:
            return False
        return value.lower() in ('true', '1', 't', 'y', 'yes')

    @property
    def opensearch_initial_admin_password(self):
        return self.configs.get('OPENSEARCH_INITIAL_ADMIN_PASSWORD')

    @property
    def opensearch_host(self):
        return self.configs.get('OPENSEARCH_HOST')

    @property
    def opensearch_port(self):
        return self.configs.get('OPENSEARCH_PORT')

    @property
    def opensearch_username(self):
        return self.configs.get('OPENSEARCH_USERNAME')

    @property
    def opensearch_password(self):
        return self.configs.get('OPENSEARCH_PASSWORD')

    @property
    def db_url(self):
        return self.configs.get('DB_URL')

    @property
    def huggingface_api_key(self):
        return self.configs.get('HUGGINGFACE_API_KEY')

    @property
    def openai_api_key(self):
        return self.configs.get('OPENAI_API_KEY')

    @property
    def default_model(self):
        return self.configs.get('DEFAULT_MODEL')

    @property
    def secret_key(self):
        return self.configs.get('SECRET_KEY')

    @property
    def db_name(self):
        return self.configs.get('DB_NAME')

    @property
    def vllm_api_base(self):
        return self.configs.get('VLLM_API_BASE')

    @property
    def app_store_json_path(self):
        return self.configs.get('APP_STORE_JSON_PATH')

    @property
    def applications_json_path(self):
        return self.configs.get('APPLICATIONS_JSON_PATH')

    @property
    def langchain_model(self):
        return self.configs.get('LANGCHAIN_MODEL')

    @property
    def access_token_expire(self):
        return self.configs.get('ACCESS_TOKEN_EXPIRE')

    @property
    def refresh_token_expire(self):
        return self.configs.get('REFRESH_TOKEN_EXPIRE')

    @property
    def file_index_name(self):
        return self.configs.get('FILE_INDEX_NAME')

    @property
    def is_history_enabled(self):
        return self._to_bool(self.configs.get('IS_HISTORY_ENABLED'))

    @property
    def history_messages_count(self):
        return int(self.configs.get('HISTORY_MESSAGES_COUNT', 0))

    @property
    def chunk_size(self):
        return int(self.configs.get('CHUNK_SIZE', 0))

    @property
    def chunk_overlap(self):
        return int(self.configs.get('CHUNK_OVERLAP', 0))

    @property
    def k(self):
        return int(self.configs.get('K', 0))

    @property
    def enable_internet(self):
        return self._to_bool(self.configs.get('ENABLE_INTERNET'))

    @property
    def enable_cyber_news(self):
        return self._to_bool(self.configs.get('ENABLE_CYBER_NEWS'))

    @property
    def enable_fetch_content(self):
        return self._to_bool(self.configs.get('ENABLE_FETCH_CONTENT'))

    @property
    def mode(self):
        return self.configs.get('MODE')

    @property
    def private_base_url(self):
        return self.configs.get('PRIVATE_BASE_URL')

    @property
    def private_secret_key(self):
        return self.configs.get('PRIVATE_SECRET_KEY')

    @property
    def private_open_ai_key(self):
        return self.configs.get('PRIVATE_OPENAI_KEY')

    @property
    def neo4j_uri(self):
        return self.configs.get('NEO4J_URI')

    @property
    def neo4j_username(self):
        return self.configs.get('NEO4J_USERNAME')

    @property
    def neo4j_password(self):
        return self.configs.get('NEO4J_PASSWORD')
    @property
    def private_model(self):
        return self.configs.get('PRIVATE_MODEL')

config = AppConfig()