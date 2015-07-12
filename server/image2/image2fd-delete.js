/* TODO

trigger BoxFoldersDeleteTg on BoxFolders for delete
  as
    delete BoxFoldersPhotos
    from  BoxFoldersPhotos FP join deleted F on FP.FolderID = F.FolderID

    delete BoxFolderComments
    from BoxFolderComments C join deleted D on C.FolderID = D.FolderID

    delete BoxFrontFolders
    from  BoxFrontFolders FF join deleted F on FF.FolderID = F.FolderID
  go

procedure BoxFolderDelete
  @FolderID int
  ,@Result  int output
  as
  
  delete from BoxFolders
  where 
    FolderID = @FolderID and 
    (Func != 'S' or (select count(*) from BoxFoldersPhotos where FolderID = @FolderID) = 0)
  select @Result = @@rowcount
go


public class FDelete : WebSite.Com.BoxPhoto.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.CheckBox DeleteCB;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.WebControls.CheckBox DeletePhotoCB;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertBoxAdmin();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      if (!IsPostBack) {
        DeletePhotoCB.Enabled = false;
      }
    }

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e)
    {
      //
      // CODEGEN: This call is required by the ASP.NET Web Form Designer.
      //
      InitializeComponent();
      base.OnInit(e);
    }
    
    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {    
      this.Submit.Click += new System.EventHandler(this.Submit_Click);
      this.Load += new System.EventHandler(this.Page_Load);

    }
    #endregion

    private bool DeleteFolder(SqlConnection conn) {
      SqlCommand cmd;
      cmd = new SqlCommand("BoxFolderDelete", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
      cmd.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.Output;
      cmd.ExecuteNonQuery();
      return (int)cmd.Parameters["@Result"].Value > 0;
    }

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid && DeleteCB.Checked) {
        SqlConnection conn;
        SqlConnection conn2;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          ctx.ReadFolder(conn);
          Assert(IsAdmin || ctx.Folder.UserID == OwnerID);
          if (DeletePhotoCB.Enabled) {
            if (DeletePhotoCB.Checked) {
              using (conn2 = new SqlConnection(WebSite.Global.DSN)) {
                conn2.Open();
                cmd = new SqlCommand("BoxFPSelect", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
                reader = cmd.ExecuteReader();
                while (reader.Read()) {
                  WebSite.Com.BoxPhoto.PDelete.DeleteBoxPhoto(conn2, (int)reader["PhotoID"], UserID, IsAdmin);
                }
                reader.Close();
                if (DeleteFolder(conn)) {
                  ctx.UrlMaker.AddParam("l",null).Redirect("FList.aspx");
                }
              }
            }
          } else {
            if (ctx.Folder.Func == BoxPhotoContext.FuncPrimary && ctx.Folder.PhotoCnt > 0) {
              DeletePhotoCB.Enabled = true;
            } else {
              if (DeleteFolder(conn)) {
                ctx.UrlMaker.AddParam("l",null).Redirect("FList.aspx");
              } else {
                DeletePhotoCB.Enabled = true;
              }
            }
          }
        }
      }
    }
  }
*/