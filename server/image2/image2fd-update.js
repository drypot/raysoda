/* TODO

procedure BoxFolderUpdate
  @FolderID int
  ,@UserID    int
  ,@SortKey char(1)
  ,@SortDir char(1)
  ,@FHidden char(1)
  ,@SortValue int
  ,@ThumbCount  int
  ,@Title   nvarchar(128)
  ,@Music   varchar(1024)
  ,@Comment ntext
  ,@Note    ntext
  as

  update BoxFolders
    set SortKey = @SortKey, SortDir = @SortDir, FHidden = @FHidden, SortValue =@SortValue, Title = @Title, Music = @Music, Comment = @Comment, Note = @Note, ThumbCount = @ThumbCount
    where FolderID = @FolderID and UserID = @UserID 
go


public class FEdit : WebSite.Com.BoxPhoto.Page
  {
    protected System.Web.UI.WebControls.ValidationSummary VdSummary;
    protected System.Web.UI.WebControls.RequiredFieldValidator TitleTBVd;
    protected System.Web.UI.WebControls.TextBox TitleTB;
    protected System.Web.UI.WebControls.TextBox CommentTB;
    protected System.Web.UI.WebControls.TextBox NoteTB;
    protected System.Web.UI.WebControls.TextBox MusicTB;
    protected System.Web.UI.WebControls.RadioButtonList SortKeyRBL;
    protected System.Web.UI.WebControls.RadioButtonList SortDirRBL;
    protected System.Web.UI.WebControls.RequiredFieldValidator SortValueTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator SortValueTBRegVd;
    protected System.Web.UI.WebControls.TextBox SortValueTB;
    protected System.Web.UI.WebControls.RequiredFieldValidator ThumbCountTBReqVd;
    protected System.Web.UI.WebControls.RegularExpressionValidator ThumbCountTBRegVD;
    protected System.Web.UI.WebControls.TextBox ThumbCountTB;
    protected System.Web.UI.WebControls.Button Submit;

    private BoxPhotoContext ctx;

    private void Page_Load(object sender, System.EventArgs e) {
      AssertBoxAdmin();
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;

      if (!IsPostBack) {
        SqlConnection conn;
        SqlCommand cmd;
        SqlDataReader reader;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxFolderSelect", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          //cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          reader = cmd.ExecuteReader();
          if (reader.Read()) {
            TitleTB.Text = (string)reader["Title"];
            CommentTB.Text = (string)reader["Comment"];
            NoteTB.Text = (string)reader["Note"];
            MusicTB.Text = (string)reader["Music"];
            SortValueTB.Text = reader["SortValue"].ToString();
            ThumbCountTB.Text = reader["ThumbCount"].ToString();
            //SortKeyRBL.Items.FindByValue((string)reader["SortKey"]).Selected = true;
            SortDirRBL.Items.FindByValue((string)reader["SortDir"]).Selected = true;
          }
          reader.Close();
        }
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

    private void Submit_Click(object sender, System.EventArgs e) {
      if (IsValid) {
        SqlConnection conn;
        SqlCommand cmd;
        using (conn = new SqlConnection(WebSite.Global.DSN)) {
          conn.Open();
          cmd = new SqlCommand("BoxFolderUpdate", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = ctx.FolderID;
          cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = 'V'; //SortKeyRBL.SelectedValue[0];
          cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = SortDirRBL.SelectedValue[0];
          cmd.Parameters.Add("@FHidden", SqlDbType.Char, 1).Value = 'N';
          cmd.Parameters.Add("@SortValue", SqlDbType.Int).Value = Int32.Parse(SortValueTB.Text);
          cmd.Parameters.Add("@ThumbCount", SqlDbType.Int).Value = Int32.Parse(ThumbCountTB.Text);
          cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 128).Value = TitleTB.Text.Trim();
          cmd.Parameters.Add("@Music", SqlDbType.VarChar, 1024).Value = MusicTB.Text.Trim();
          cmd.Parameters.Add("@Comment", SqlDbType.NText).Value = CommentTB.Text.Trim();
          cmd.Parameters.Add("@Note", SqlDbType.NText).Value = NoteTB.Text.Trim();
          cmd.ExecuteNonQuery();
          //ctx.UrlMaker.Redirect("FView.aspx");
          //Response.Redirect("/Com/Etc/HB2.htm");
          ReturnToHostPage();
        }
      }
    }
  }


<%@ Page language="c#" AutoEventWireup="false" Inherits="WebSite.Com.BoxPhoto.FEdit" CodeBehind="FEdit.aspx.cs" %>
<%@ Register TagPrefix="bah" NameSpace="Bah.Web.Controls" Assembly="Bah"%>

<HTML>
<head>
<%=LPContext.ClientInitScript%>
</head>

<body>
<form runat="server" ID="Form">
<script>lpRenderBegin()</script>
<div class=fm>
<script>lpRenderTitle("폴더 수정")</script>

<asp:ValidationSummary Runat="server" ID="VdSummary" DisplayMode="List" ShowSummary="true" ShowMessageBox="false" CssClass="vdsummary"/>

<div class=fm-bbs>

<div class=form>
폴더이름
<asp:RequiredFieldValidator Runat="server" ID="TitleTBVd" ControlToValidate="TitleTB" Text="*" ErrorMessage="폴더이름을 입력해 주십시오." Display="Dynamic"/>
<br>
<asp:TextBox Runat="server" ID="TitleTB" CssClass="tb-full" MaxLength="128" TextMode=MultiLine Rows=4></asp:TextBox>
</div>

<div class=form>
폴더내용
<br>
<asp:TextBox Runat="server" ID="CommentTB" TextMode="MultiLine" Rows="15"></asp:TextBox>
<div class=desc>사진들에 대한 개략적 설명. HTML 태그는 사용하실 수 없습니다.</div>
</div>

<div class=form>
촬영노트
<br>
<asp:TextBox Runat="server" ID="NoteTB" TextMode="MultiLine" Rows="5"></asp:TextBox>
<div class=desc>폴더에 포함된 사진들에 표시할 촬영정보. HTML 태그는 사용하실 수 없습니다.</div>
</div>

<div class=form>
배경음악 링크<br>
<asp:TextBox Runat="server" ID="MusicTB" CssClass="tb-full" MaxLength="1024"></asp:TextBox>
<div class=desc>예: http://www.musicsite.com/dir/music.asf</div>
</div>

<div class=form>
폴더 정렬값
<asp:RequiredFieldValidator Runat="server" ID="SortValueTBReqVd" ControlToValidate="SortValueTB" Text="*" ErrorMessage="폴더 정렬값을 입력해 주십시오." Display="Dynamic"/>
<asp:RegularExpressionValidator runat="server" id="SortValueTBRegVd" ControlToValidate="SortValueTB" ValidationExpression="[0-9]{1,10}" Text="*" ErrorMessage="폴더 정렬값은 수치를 입력하셔야 합니다." display="Dynamic"/>
<br>
<asp:TextBox Runat="server" ID="SortValueTB" CssClass="tb" MaxLength="10" Width="120">0</asp:TextBox><br>
</div>

<div class=form>
폴더목록에 섬네일 표시 갯수
<asp:RequiredFieldValidator Runat="server" ID="ThumbCountTBReqVd" ControlToValidate="ThumbCountTB" Text="*" ErrorMessage="섬네일 표시 갯수를 입력해 주십시오." Display="Dynamic"/>
<asp:RegularExpressionValidator runat="server" id="ThumbCountTBRegVD" ControlToValidate="ThumbCountTB" ValidationExpression="[0-9]{1,2}" Text="*" ErrorMessage="섬네일 표시 갯수에는 두자리 수치를 입력하셔야 합니다." display="Dynamic"/>
<br>
<asp:TextBox Runat="server" ID="ThumbCountTB" CssClass="tb" MaxLength="10" Width="120">0</asp:TextBox><br>
</div>

<%--
<div class=form>
사진 정렬 기준<br>
<asp:RadioButtonList Runat=server ID="SortKeyRBL" RepeatDirection=Horizontal RepeatLayout=Flow>
  <asp:ListItem Value="C" Selected>등록일순</asp:ListItem>
  <asp:ListItem Value="V">정렬값순</asp:ListItem>
</asp:RadioButtonList>
</div>
--%>

<div class=form>
사진 정렬 방향<br>
<asp:RadioButtonList Runat=server ID="SortDirRBL" RepeatDirection=Horizontal RepeatLayout=Flow>
<asp:ListItem Value="A" Selected>오름차순</asp:ListItem>
<asp:ListItem Value="D">내림차순</asp:ListItem>
</asp:RadioButtonList>
</div>

<div class=form-submit>
<asp:Button Runat="server" ID="Submit" Text="   확인   " CssClass="btn"></asp:Button>
</div>

</div>


</div>
<script>lpRenderEnd()</script>
</form>
</body>
</html>


*/