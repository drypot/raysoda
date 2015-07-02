/* TODO

public class FNew : WebSite.Com.Note.Page
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
    protected System.Web.UI.WebControls.Button Submit;
    protected System.Web.UI.HtmlControls.HtmlGenericControl AttachPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl OptPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl FormPanel;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgFull;
    protected System.Web.UI.HtmlControls.HtmlGenericControl MsgModeBPanel;

    NoteContext nc;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();
      nc = NoteContext;
      if (!IsBBSAdmin) {
        switch (nc.Function) {
          case NoteContext.FuncPublic:
            AssertFailed();
            break;
          case NoteContext.FuncBox:
            Assert(IsBoxAdmin);
            PhotoCB.Visible = false;
            PhotoCB.Checked = false;
            MsgModeBPanel.Visible = true;
            break;
          default:
            AssertFailed();
            break;
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
          cmd = new SqlCommand("BBSFolderInsert", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          switch (nc.Function) {
            case NoteContext.FuncBox:
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char, 1).Value = Folder.OwnerTypeBox;
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = OwnerID;
              cmd.Parameters.Add("@ATTE", SqlDbType.Char, 1).Value = ATTECB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTR", SqlDbType.Char, 1).Value = ATTRCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTM", SqlDbType.Char, 1).Value = ATTMCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTO", SqlDbType.Char, 1).Value = ATTOCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@Photo", SqlDbType.Char, 1).Value = 'N';
              cmd.Parameters.Add("@Hidden", SqlDbType.Char, 1).Value = HiddenCB.Checked ? 'Y' : 'N';
              break;
            default: // NoteContext.FuncPublic
              cmd.Parameters.Add("@OwnerType", SqlDbType.Char, 1).Value = Folder.OwnerTypePublic;
              cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = 0;
              cmd.Parameters.Add("@ATTE", SqlDbType.Char, 1).Value = ATTECB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTR", SqlDbType.Char, 1).Value = ATTRCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTM", SqlDbType.Char, 1).Value = ATTMCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@ATTO", SqlDbType.Char, 1).Value = ATTOCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@Photo", SqlDbType.Char, 1).Value = PhotoCB.Checked ? 'Y' : 'N';
              cmd.Parameters.Add("@Hidden", SqlDbType.Char, 1).Value = HiddenCB.Checked ? 'Y' : 'N';
              break;
          }
          cmd.Parameters.Add("@SortValue", SqlDbType.Int).Value = 0;
          cmd.Parameters.Add("@SampleDay", SqlDbType.Int).Value = Int32.Parse(SampleDayTB.Text);
          cmd.Parameters.Add("@SampleMin", SqlDbType.Int).Value = Int32.Parse(SampleMinTB.Text);
          cmd.Parameters.Add("@DisGuestNew", SqlDbType.Char, 1).Value = DisGuestNewCB.Checked ? 'Y' : 'N';
          cmd.Parameters.Add("@DisGuestReply", SqlDbType.Char, 1).Value = DisGuestReplyCB.Checked ? 'Y' : 'N';
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.ExecuteNonQuery();
        }
        if ((int)cmd.Parameters["@Result"].Value > 0) {
          nc.UrlMaker.Redirect("View.aspx");
        } else {
          FormPanel.Visible = false;
          MsgFull.Visible = true;
        }
      }
    }
  }

  
drop procedure BBSFolderInsert
go
create procedure BBSFolderInsert
  @OwnerType char(1)
  ,@OwnerID int
  ,@SortValue int = 0
  ,@SampleDay int = 7
  ,@SampleMin int = 10
  ,@ATTE char(1) = 'Y'
  ,@ATTR char(1) = 'Y'
  ,@ATTM char(1) = 'Y'
  ,@ATTO char(1) = 'N'
  ,@DisGuestNew char(1) = 'N'
  ,@DisGuestReply char(1) = 'N'
  ,@Hidden char(1) = 'N'
  ,@Photo char(1) = 'N'
  ,@Title nvarchar(128)
  ,@Result int output
  as

  declare @FolderID int

  exec SeqNextValue 'bbsfolder', @FolderID output

  --*
  if (
    @OwnerType = 'A' or
    (@OwnerType = 'B' and (select count(*) from BBSFolders where OwnerType = @OwnerType and OwnerID = @OwnerID) < 7)
  )
  begin
  --/
    insert 
      BBSFolders(
        FolderID 
        ,OwnerType 
        ,OwnerID 
        ,SortValue
        ,SampleDay 
        ,SampleMin 
        ,ATTE
        ,ATTR 
        ,ATTM 
        ,ATTO 
        ,DisGuestNew
        ,DisGuestReply
        ,HIdden
        ,Photo
        ,Title
      )
    select 
      @FolderID
      ,@OwnerType
      ,@OwnerID
      ,case when @SortValue = 0 then isnull(max(SortValue),0) + 10 else @SortValue end
      ,@SampleDay
      ,@SampleMin 
      ,@ATTE
      ,@ATTR
      ,@ATTM
      ,@ATTO
      ,@DisGuestNew
      ,@DisGuestReply
      ,@HIdden
      ,@Photo
      ,@Title
    from BBSFolders
    where 
      OwnerType = @OwnerType and 
      OwnerID = @OwnerID
    select @Result = @@rowcount
  --*
  end
  else
    select @Result = 0
  --*
go

*/
