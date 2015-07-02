/*

public class BoxPhotoFolder {
    public int FolderID;
    public int UserID;
    public DateTime CDate;
    public DateTime UDate;
    public int Hit;
    public char SortKey;
    public char SortDir;
    public char Func;
    public bool Hidden;
    public int SortValue;
    public int ThumbCount;
    public string Title;
    public string Music;
    public string Comment;
    public string Note;
    public int PhotoCnt;

    public void Read (WebSite.Page page, SqlConnection conn, int folderID) {
      SqlCommand cmd;
      SqlDataReader reader;
      cmd = new SqlCommand("BoxFolderSelect", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderID;
      reader = cmd.ExecuteReader();
      if (reader.Read()) {
        FolderID = (int)reader["FolderID"];
        UserID = (int)reader["UserID"];
        CDate = (DateTime)reader["CDate"];
        UDate = (DateTime)reader["UDate"];
        Hit = (int)reader["Hit"];
        SortKey = reader["SortKey"].ToString()[0];
        SortDir = reader["SortDir"].ToString()[0];
        Func = reader["Func"].ToString()[0];
        Hidden = reader["FHidden"].ToString()[0] == 'Y';
        SortValue = (int)reader["SortValue"];
        ThumbCount = (int)reader["ThumbCount"];
        Title = reader["Title"].ToString();
        Music = reader["Music"].ToString();
        Comment = reader["Comment"].ToString();
        Note = reader["Note"].ToString();
        PhotoCnt = (int)reader["PhotoCnt"];
      } else {
        page.ShowInvalidPage();
      }
      reader.Close();
    }
  }










*/
