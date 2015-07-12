/* TODO

protected System.Web.UI.WebControls.ValidationSummary Validationsummary1;
    protected System.Web.UI.WebControls.RequiredFieldValidator CommentTBVd;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.CheckBox DeleteCB;
    protected System.Web.UI.WebControls.Button Submit;

    protected System.Web.UI.WebControls.TextBox GuestNameTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator GuestNameVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator GuestNameREVd;
    protected System.Web.UI.WebControls.TextBox GuestPasswordTB;
    protected System.Web.UI.HtmlControls.HtmlGenericControl GuestNamePanel;
    protected Bah.Web.Controls.DummyValidator GuestPasswordMMVd;

    private int cmtID;
    private BoxPhotoContext ctx;

    int cmtUserID;
    string cmtGuestPassword;

    private void Page_Load(object sender, System.EventArgs e) {
      //AssertAuthenticated();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      cmtID = Int32.Parse(Request.QueryString["cmt"]);

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        cmd = new SqlCommand("BoxPCSelect", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@CommentID", SqlDbType.Int).Value = cmtID;
        reader = cmd.ExecuteReader();
        if (reader.Read()) {
          cmtUserID = (int)reader["UserID"];
          cmtGuestPassword = (string)reader["GuestPassword"];
          if (!IsPostBack) {
            if (cmtUserID == 0) {
              GuestNamePanel.Visible = true;
              GuestNameTB.Text = (string)reader["GuestName"];
              GuestNameTB.Enabled = IsAdmin || !User.IsAuthenticated;
              GuestPasswordTB.Visible = !User.IsAuthenticated;
            }
            CommentTB.Text = (string)reader["Comment"];
            CommentTB.Enabled = IsAdmin || cmtUserID == UserID;
            SaveHostPage();
          }
        } else {
          Response.End();
        }
        reader.Close();
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

    private void Submit_Click(object sender, System.EventArgs e) {
      if (GuestNamePanel.Visible && GuestPasswordTB.Visible && cmtGuestPassword != GuestPasswordTB.Text.Trim()) {
        GuestPasswordMMVd.IsValid = false;
      }
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          if (DeleteCB.Checked) {
            cmd = new SqlCommand("BoxPCDelete",conn);
            cmd.CommandType = CommandType.StoredProcedure;
          } else {
            cmd = new SqlCommand("BoxPCUpdate",conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Comment", SqlDbType.NVarChar, 4000).Value = CommentTB.Text.Trim();
            cmd.Parameters.Add("@GuestName", SqlDbType.NVarChar, 16).Value = GuestNameTB.Text.Trim();
          }
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = ctx.PhotoID;
          cmd.Parameters.Add("@CommentID", SqlDbType.Int).Value = cmtID;
          if (!IsAdmin) {
            if (User.IsAuthenticated) {
              cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
            } else {
              cmd.Parameters.Add("@GuestPassword", SqlDbType.NVarChar, 16).Value = GuestPasswordTB.Text.Trim();
            }
          }
          cmd.ExecuteNonQuery();
        }
        //Response.Redirect("/Com/Etc/HB2.htm");
        //ctx.UrlMaker.AddParam("pg", null).AddParam("p",ctx.PhotoID).Redirect("PView.aspx");
        ReturnToHostPage();
      }
    }
    
procedure BoxPCUpdate
    @PhotoID  int
    ,@CommentID int
    ,@UserID  int = null
    ,@GuestPassword nvarchar(16) = null
    ,@GuestName nvarchar(16)
    ,@Comment nvarchar(4000)
    as

    update BoxPhotoComments
    set Comment = @Comment, GuestName = @GuestName
    where 
      CommentID = @CommentID and
      PhotoID = @PhotoID and
      (
        (@UserID is null and @GuestPassword is null) or 
        (@UserID is not null and UserID = @UserID) or
        (@GuestPassword is not null and GuestPassword = @GuestPassword)
      ) 
  go


*/