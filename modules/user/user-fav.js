/* TODO:

show following

using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        PageOwnerName = UserManager.GetUser(OwnerID).Name;
        
        cmd = new SqlCommand("UserFavSelectTargetUserList", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@OwnerUserID", SqlDbType.Int).Value = OwnerID;
        reader = cmd.ExecuteReader();
        UserList.DataSource = reader;
        UserList.DataBind();
        reader.Close();
      }

      
show followers

using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        PageOwnerName = UserManager.GetUser(OwnerID).Name;

        cmd = new SqlCommand("UserFavSelectOwnerUserList", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@TargetUserID", SqlDbType.Int).Value = OwnerID;
        reader = cmd.ExecuteReader();
        UserList.DataSource = reader;
        UserList.DataBind();
        reader.Close();
      }

*/