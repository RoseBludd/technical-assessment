-- Drop existing objects if they exist
DROP TYPE IF EXISTS workspace_server_status CASCADE;
DROP TABLE IF EXISTS workspace_servers CASCADE;
DROP FUNCTION IF EXISTS get_next_available_workspace();

-- Create enum for workspace server status
CREATE TYPE workspace_server_status AS ENUM ('available', 'in_use', 'maintenance');

-- Create table for workspace servers
CREATE TABLE workspace_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_path TEXT NOT NULL,  -- e.g. 'c:\Users\GENIUS\Desktop\User3'
    display_name TEXT NOT NULL,    -- e.g. 'User Workspace 3'
    vpn_config_path TEXT NOT NULL, -- Path to the .ovpn file
    rdp_username TEXT NOT NULL DEFAULT 'vpnuser3',
    rdp_password TEXT NOT NULL DEFAULT 'Roof$7663',
    status workspace_server_status NOT NULL DEFAULT 'available',
    assigned_to TEXT REFERENCES task_assignments(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at
CREATE TRIGGER update_workspace_servers_updated_at
    BEFORE UPDATE ON workspace_servers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial workspace servers
INSERT INTO workspace_servers (workspace_path, display_name, vpn_config_path) VALUES
    ('c:\Users\GENIUS\Desktop\User3', 'Workspace Server 3', 'c:\Users\GENIUS\Desktop\User3\*.ovpn'),
    ('c:\Users\GENIUS\Desktop\User4', 'Workspace Server 4', 'c:\Users\GENIUS\Desktop\User4\*.ovpn'),
    ('c:\Users\GENIUS\Desktop\User5', 'Workspace Server 5', 'c:\Users\GENIUS\Desktop\User5\*.ovpn');

-- Create function to get next available workspace
CREATE OR REPLACE FUNCTION get_next_available_workspace()
RETURNS TABLE (
    id UUID,
    workspace_path TEXT,
    vpn_config_path TEXT,
    rdp_username TEXT,
    rdp_password TEXT
) AS $$
BEGIN
    RETURN QUERY
    UPDATE workspace_servers
    SET 
        status = 'in_use',
        assigned_at = CURRENT_TIMESTAMP
    WHERE id = (
        SELECT id 
        FROM workspace_servers 
        WHERE status = 'available'
        ORDER BY updated_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING 
        id,
        workspace_path,
        vpn_config_path,
        rdp_username,
        rdp_password;
END;
$$ LANGUAGE plpgsql; 