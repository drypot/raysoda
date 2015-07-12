/* TODO

protected override void OnLoad(EventArgs e) {
      string id = Request.QueryString["id"];
      string url = null;
      XmlNode node = ApplicationFactory.GetApplication("App").ConfigDocument.DocumentElement.SelectSingleNode("/LPathConfig/spAdv/ad[@id=\"" + id + "\"]/@url");

      if (node != null) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("CountPerDayInc", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@CountID", SqlDbType.VarChar, 256).Value = id;
          cmd.ExecuteNonQuery();
        }
        Response.Redirect(node.Value);
      } else {
        Response.Write("Unknown AD ID");
        Response.End();
      }
    }
    
*/