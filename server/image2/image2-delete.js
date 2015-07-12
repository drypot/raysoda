
/* TODO

protected System.Web.UI.WebControls.CheckBox DeleteCB;
    protected System.Web.UI.WebControls.Button Submit;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      if (!IsPostBack) {
        SaveHostPage();
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

    public static void DeleteBoxPhoto(SqlConnection conn, int PhotoID, int UserID, bool isAdmin) {
      SqlCommand cmd = new SqlCommand("BoxPhotoDelete", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value= PhotoID;
      cmd.Parameters.Add("@UserID", SqlDbType.Int).Direction = ParameterDirection.InputOutput;
      if (!isAdmin) {
        cmd.Parameters["@UserID"].Value = UserID;
      }
      cmd.Parameters.Add("@RowCount", SqlDbType.Int).Direction = ParameterDirection.Output;
      cmd.ExecuteNonQuery();
      if ((int)cmd.Parameters["@RowCount"].Value > 0) {
        new BDSManager((int)cmd.Parameters["@UserID"].Value, conn, "P", PhotoID).DeleteFiles();
        new BDSManager((int)cmd.Parameters["@UserID"].Value, conn, "T", 0).DeleteFile(PhotoID + ".jpg");
      }
    }

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid && DeleteCB.Checked) {
        SqlConnection conn;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          DeleteBoxPhoto(conn, ctx.PhotoID, UserID, IsAdmin);
          ctx.RedirectToPhotoList();
        } 
      }
      ReturnToHostPage();
    }
  }

  
trigger BoxPhotosDeleteTg on BoxPhotos for delete
  as
    delete BoxFoldersPhotos
    from BoxFoldersPhotos F join deleted D on F.PhotoID = D.PhotoID

    delete BoxPhotoComments
    from BoxPhotoComments C join deleted D on C.PhotoID = D.PhotoID
  go

procedure BoxPhotoDelete
    @PhotoID int output
    ,@UserID int = null output
    ,@RowCount int output
    as
    
    if (@UserID is null)
      select @UserID = UserID from BoxPhotos where PhotoID = @PhotoID
      
    delete BoxPhotos
    where 
      PhotoID = @PhotoID and 
      UserID = @UserID

    select @RowCount = @@rowcount
  go

*/



