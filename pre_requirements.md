
### Running the Scripts

Here are the steps to run each script:

#### 1. Backup

Creates a backup of your MongoDB database and saves the backup files in a directory with a timestamp in the root project folder.

**Command**:

`python utils/backup.py` 

#### 2. Create Admin User

Creates a new admin user in the MongoDB database.

**Command**:

`python utils/create_admin.py` 

#### 3. Reset Admin Password

Resets the password for an existing admin user.

**Command**:

`python utils/reset_admin_password.py` 

#### 4. Create Default System Experts

Creates default system experts needed inside the application.

**Command**:

`python utils/create_default_sys_experts.py` 

#### 5. Reset Default System Experts

Resets the default system experts to their initial state.

**Command**:

`python utils/reset_default_sys_experts.py` 

#### 6. Restore Database

Restores the MongoDB database from the backup JSON files. You need to provide the path to the backup directory as a command-line argument.

**Command**:

`python utils/restore.py path_to_backup_directory` 

### Summary

1.  **Ensure Python and required packages are installed**.
2.  **Set up the `.env` file** with your MongoDB connection details in the root project directory.
3.  **Run the scripts** using the provided commands.

By following these steps, you can efficiently manage backups, create and reset users, and handle system experts in your MongoDB database.