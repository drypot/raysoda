/* TODO

public class FEdit : WebSite.Com.Note.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TitleTBVd;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.CheckBox ATTECB;
    protected System.Web.UI.WebControls.CheckBox ATTRCB;
    protected System.Web.UI.WebControls.CheckBox ATTMCB;
    protected System.Web.UI.WebControls.CheckBox ATTOCB;
    protected System.Web.UI.WebControls.CheckBox DisGuestNewCB;
    protected System.Web.UI.WebControls.CheckBox DisGuestReplyCB;
    protected System.Web.UI.WebControls.CheckBox HiddenCB;
    protected System.Web.UI.WebControls.CheckBox PhotoCB;
    protected System.Web.UI.WebControls.RequiredFieldValidator SampleDayTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator SampleDayTBRegVd;
    protected System.Web.UI.WebControls.TextBox SampleDayTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator SampleMinTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator SampleMinTBRegVd;
    protected System.Web.UI.WebControls.TextBox SampleMinTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator SortValueTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator SortValueTBRegVd;
    protected System.Web.UI.WebControls.TextBox SortValueTB;
    protected System.Web.UI.WebControls.CheckBox DeleteCB;
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl FormPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl AttachPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl OptPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgIsNotEmpty;

    NoteContext nc;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();
      nc = NoteContext;

      Assert(nc.FolderID > 0);

      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        nc.ReadFolder(conn);

        if (!nc.IsFolderAdmin) {
          ShowNotAllowed();
        }
        if (!IsBBSAdmin) {
          switch (nc.Function) {
            case NoteContext.FuncPublic:
              AssertFailed();
              break;
            case NoteContext.FuncBox:
              PhotoCB.Visible = false;
              PhotoCB.Checked = false;
              break;
            default:
              AssertFailed();
              break;
          }
        }

        if (!IsPostBack) {
          cmd = new SqlCommand("BBSFolderSelect", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = nc.FolderID;
          reader = cmd.ExecuteReader();
          reader.Read();
          SortValueTB.Text = reader["SortValue"].ToString();
          SampleDayTB.Text = reader["SampleDay"].ToString();
          SampleMinTB.Text = reader["SampleMin"].ToString();
          ATTECB.Checked = ((string)reader["ATTE"])[0] == 'Y';
          ATTRCB.Checked = ((string)reader["ATTR"])[0] == 'Y';
          ATTMCB.Checked = ((string)reader["ATTM"])[0] == 'Y';
          ATTOCB.Checked = ((string)reader["ATTO"])[0] == 'Y';
          DisGuestNewCB.Checked = ((string)reader["DisGuestNew"])[0] == 'Y';
          DisGuestReplyCB.Checked = ((string)reader["DisGuestReply"])[0] == 'Y';
          HiddenCB.Checked = ((string)reader["Hidden"])[0] == 'Y';
          PhotoCB.Checked = ((string)reader["Photo"])[0] == 'Y';
          TitleTB.Text = (string)reader["Title"];
          reader.Close();
        }
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
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          if (DeleteCB.Checked) {
            cmd = new SqlCommand("BBSFolderDelete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = nc.FolderID;
            cmd.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.ExecuteNonQuery();
            if ((int)cmd.Parameters["@Result"].Value > 0) {
              Response.Redirect(nc.GetCleanFolderListViewUrl());
            } else {
              FormPanel.Visible = false;
              MsgIsNotEmpty.Visible = true;
            }
          } else {
            cmd = new SqlCommand("BBSFolderUpdate", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = nc.FolderID;
            switch (nc.Function) {
              case NoteContext.FuncBox:
                cmd.Parameters.Add("@ATTE", SqlDbType.Char, 1).Value = ATTECB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTR", SqlDbType.Char, 1).Value = ATTRCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTM", SqlDbType.Char, 1).Value = ATTMCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTO", SqlDbType.Char, 1).Value = ATTOCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@Photo", SqlDbType.Char, 1).Value = 'N';
                cmd.Parameters.Add("@Hidden", SqlDbType.Char, 1).Value = HiddenCB.Checked ? 'Y' : 'N';
                break;
              default: // NoteContext.FuncPublic
                cmd.Parameters.Add("@ATTE", SqlDbType.Char, 1).Value = ATTECB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTR", SqlDbType.Char, 1).Value = ATTRCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTM", SqlDbType.Char, 1).Value = ATTMCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@ATTO", SqlDbType.Char, 1).Value = ATTOCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@Photo", SqlDbType.Char, 1).Value = PhotoCB.Checked ? 'Y' : 'N';
                cmd.Parameters.Add("@Hidden", SqlDbType.Char, 1).Value = HiddenCB.Checked ? 'Y' : 'N';
                break;
            }
            cmd.Parameters.Add("@SortValue", SqlDbType.Int).Value = Int32.Parse(SortValueTB.Text);
            cmd.Parameters.Add("@SampleDay", SqlDbType.Int).Value = Int32.Parse(SampleDayTB.Text);
            cmd.Parameters.Add("@SampleMin", SqlDbType.Int).Value = Int32.Parse(SampleMinTB.Text);
            cmd.Parameters.Add("@DisGuestNew", SqlDbType.Char, 1).Value = DisGuestNewCB.Checked ? 'Y' : 'N';
            cmd.Parameters.Add("@DisGuestReply", SqlDbType.Char, 1).Value = DisGuestReplyCB.Checked ? 'Y' : 'N';
            cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
            cmd.ExecuteNonQuery();
            Response.Redirect(nc.GetCleanFolderListViewUrl());
          }
        }
      }
    }

  }
  
drop procedure BBSFolderUpdate
go
create procedure BBSFolderUpdate
  @FolderID int
  ,@SortValue int
  ,@SampleDay int
  ,@SampleMin int
  ,@ATTE char(1)
  ,@ATTR char(1)
  ,@ATTM char(1)
  ,@ATTO char(1)
  ,@DisGuestNew char(1)
  ,@DisGuestReply char(1)
  ,@Hidden char(1)
  ,@Photo char(1)
  ,@Title nvarchar(128)
  as
  update BBSFolders 
  set
    SortValue = @SortValue
    ,SampleDay = @SampleDay
    ,SampleMin = @SampleMin
    ,ATTE = @ATTE
    ,ATTR = @ATTR
    ,ATTM = @ATTM
    ,ATTO = @ATTO
    ,DisGuestNew = @DisGuestNew
    ,DisGuestReply = @DisGuestReply
    ,Hidden = @Hidden
    ,Photo = @Photo
    ,Title = @Title
  where FolderID = @FolderID
go

*/
