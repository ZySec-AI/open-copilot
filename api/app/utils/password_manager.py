from passlib.context import CryptContext

# Initializing the passlib context with a specific hashing algorithm, adjust as needed
app_context = CryptContext(schemes=["sha256_crypt", "md5_crypt", "des_crypt"], deprecated="auto")


class PasswordManager:
    """
    Provides password hashing and verification functionalities using custom_app_context.
    """

    @staticmethod
    def hash_password(password):
        """
        Hashes a password using the defined app context.

        :param password: The plaintext password to hash.
        :return: A hashed password.
        """
        return app_context.hash(password)

    @staticmethod
    def verify_password(password, hashed_password):
        """
        Verifies a plaintext password against a hashed password.

        :param password: The plaintext password to verify.
        :param hashed_password: The hashed password to verify against.
        :return: True if the verification is successful, False otherwise.
        """
        return app_context.verify(password, hashed_password)
